import handleTags from './tagsHandler';
import handlePages from './pagesHandler';
import { getOpeningTag, getClosingTag, nthLastIndexOf } from './utils';
import { DOMInterface, Content, TagInterface } from '../interfaces';

let remainingText = ' ';
let hasRemainingText = false;

export default function textAppending() {
  const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page
  const tags: TagInterface[] = [];

  const { removeTags } = handleTags();

  const appendTextToLastPage = (DOM: DOMInterface | Content) => {
    //Function that adds words onto the page and check if it is overflow

    //Extracting tags
    const openingTag =
      'attributes' in DOM
        ? getOpeningTag(DOM['type'], DOM['attributes'])
        : getOpeningTag(DOM['type']);
    const closingTag = getClosingTag(DOM['type']);

    //Adding in tags onto the html
    page.innerHTML = addTextBetweenTags(
      page.innerHTML,
      ` ${openingTag} ${closingTag}`
    );

    if (closingTag != '') {
      tags.push({
        openingTag: openingTag,
        closingTag: closingTag,
      });
    }

    let extraText = '';

    if ('contents' in DOM) {
      for (const content of DOM.contents) {
        if (typeof content == 'string') {
          if (!hasRemainingText) {
            const prevHTML = page.innerHTML;
            page.innerHTML = addTextBetweenTags(page.innerHTML, content);

            if (checkOverflow(page)) {
              hasRemainingText = true;
              page.innerHTML = prevHTML;

              const words = content.split(' ');

              if (words.length > 1) {
                let lastIndex = 0;
                //Adding words in batches before adding the remaining words in ones
                if (words.length > 100) {
                  lastIndex = appendTextEveryNthWord(words, 25);
                } else if (words.length > 50) {
                  lastIndex = appendTextEveryNthWord(words, 10);
                } else if (words.length > 10) {
                  lastIndex = appendTextEveryNthWord(words, 5);
                }
                const remainingWords = words.slice(lastIndex);

                lastIndex = appendTextEveryNthWord(remainingWords, 1);

                extraText = words.slice(lastIndex).join(' ');
              }
            }
          } else {
            // if (extraText.endsWith('>')) {
            //   extraText = extraText + '&nbsp' + content + '&nbsp';
            // } else {
            //   extraText += content;
            // }
            extraText += content;
          }
        } else {
          //If content is another DOM object
          appendTextToLastPage(content);

          if (hasRemainingText) {
            // Adding in the remaining text received from the children nodes to the extra text
            // If the previous extra text didn't ended with a tag, add a &nbsp to create a word spacing
            // between the newly added element and previous text.
            if (extraText[extraText.length - 2] == '>' || extraText == '') {
              extraText += remainingText;
            } else {
              extraText = extraText + '&nbsp' + remainingText + '&nbsp';
            }
          }
          tags.pop();
        }
      }
    }

    if (hasRemainingText) {
      if (DOM['type'] == 'p') {
        //to prevent the indentation of paragraph when overflowing to the next page
        //this is due to the fact that all p tags have automatic text indent thanks to css
        const paraOpeningTag = "<p  style='text-indent: 0'>";
        remainingText = paraOpeningTag + extraText + closingTag;
      } else {
        remainingText = openingTag + extraText + closingTag;
      }

      tags.pop();
    }

    return remainingText;
  };

  const appendTextEveryNthWord = (words: string[], steps: number) => {
    let index = 0;
    let stepsNum = 1;
    let text = '';

    while (index < words.length - 1) {
      text = text + words[index] + ' ';

      if (stepsNum == steps) {
        const prevHTML = page.innerHTML;

        page.innerHTML = addTextBetweenTags(page.innerHTML, text);
        text = '';

        if (checkOverflow(page)) {
          page.innerHTML = prevHTML;

          return index - stepsNum + 1;
        }

        stepsNum = 0;
      }

      stepsNum++;
      index++;
    }

    return index - stepsNum + 1;
  };

  const addTextBetweenTags = (textWithTags: string, textToAdd: string) => {
    //Function that adds text between the tags
    //<div> Hi, <b> I am </b> </div>   ...   'Kevin'   ...   tags = [b, div]
    //...
    //<div> Hi, <b> I am Kevin </b> </div>

    //First tag in the tags list
    let firstTag;
    if (tags.length > 0) {
      firstTag = tags[tags.length - 1]['closingTag'];

      let firstTagCount = 1;

      //Counting the time number of first tag appears among the tags
      for (let i = 0; i < tags.length - 1; i++) {
        if (tags[i]['closingTag'] == firstTag) {
          firstTagCount++;
        }
      }

      //<div> <div> <div> text here </div> </div> </div>
      //                            ------
      const lastOccurance = nthLastIndexOf(
        textWithTags,
        firstTag,
        firstTagCount
      );

      const suffix = textWithTags.slice(lastOccurance);
      textWithTags = textWithTags.slice(0, lastOccurance);

      textWithTags = textWithTags + textToAdd + ' ' + suffix;
    } else {
      textWithTags = textWithTags + textToAdd;
    }

    return textWithTags;
  };

  const emptyRemainingText = () => {
    remainingText = ' ';
    hasRemainingText = false;
  };

  const checkOverflow = (el: HTMLElement) => {
    const curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

    const isOverflowing =
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
  };

  return {
    hasRemainingText,
    remainingText,
    appendTextToLastPage,
    emptyRemainingText,
  };
}
