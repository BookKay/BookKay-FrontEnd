import handleTags from './tagsHandler';
import handlePages from './pagesHandler';
import { getNextWordContainingLetter } from './utils';

let remainingText = '';

export default function textAppending() {
  const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page

  const {
    getTags,
    addTags,
    removeTags,
    addTextBetweenTags,
    addOpeningTagsToText,
  } = handleTags();
  const { createPage } = handlePages();

  const appendTextEveryNthStep1 = (text: string, steps: number) => {
    const words = text.split(' ');
    let index = 0;
    let wordsNum = 0;
    let textToAdd = '';
    let calls = 0;

    remainingText = '';
    console.log(words);

    while (index < words.length) {
      console.log('wordsNum ', wordsNum);

      if (wordsNum < steps && index + 1 != words.length) {
        const word = words[index];
        console.log(index);
        console.log('word ', words[index]);

        if (word.indexOf('</') != -1) {
          //handling closing tag like </p>
          console.log('1 - ', page.innerHTML);
          callTextAppending(textToAdd, words, index - wordsNum);
          removeTags();

          wordsNum = 0;
          textToAdd = '';
        } else if (word.includes('<')) {
          //handling opening tag like <p>
          console.log('2 - ', page.innerHTML);

          const tag = getTags(text, index);
          //const tags = tag?.openingTag + ' ' + tag?.closingTag;

          const fullTags = tag.openingTag + ' ' + tag.closingTag;
          textToAdd = textToAdd + ' ' + fullTags;

          callTextAppending(textToAdd, words, index - wordsNum);
          console.log('testing', page.innerHTML);

          if (!(tag.closingTag == '')) {
            addTags(tag);
          }

          index = getNextWordContainingLetter(text, '>', index);

          wordsNum = 0;
          textToAdd = '';
        } else {
          console.log('3 - ', page.innerHTML);
          //handling normal text

          textToAdd = addTextBetweenTags(textToAdd, word);
          wordsNum++;
        }
      } else {
        console.log('textToAdd', textToAdd);
        callTextAppending(textToAdd, words, index - wordsNum);
        //console.log('4 - ', page.innerHTML);

        wordsNum = 0;
        textToAdd = '';

        //index--;
      }

      if (remainingText != '') {
        return;
      }

      index++;

      //To delete later
      calls += 1;
      if (calls > 100) {
        debugger;
      }
    }

    return '';
  };

  const appendTextEveryNthStep = (text: string, steps: number) => {
    const words = text.split(' ');
    let index = 0;
    let wordsNum = 0;
    let textToAdd = '';
    let calls = 0;

    remainingText = '';
    console.log(words);

    while (index < words.length) {
      console.log('wordsNum ', wordsNum);

      if (wordsNum < steps && index + 1 != words.length) {
        const word = words[index];

        textToAdd = textToAdd + ' ' + word;
      } else {
        console.log('textToAdd', textToAdd);
        callTextAppending(textToAdd, words, index - wordsNum);
        //console.log('4 - ', page.innerHTML);

        wordsNum = 0;
        textToAdd = '';

        //index--;
      }

      if (remainingText != '') {
        return;
      }

      index++;

      //To delete later
      calls += 1;
      if (calls > 100) {
        debugger;
      }
    }

    return '';
  };

  const callTextAppending = (
    text: string,
    words: string[],
    lastAddedWordIndex: number
  ) => {
    const prevText = page.innerHTML;
    emptyRemainingText();

    const returnedOne = addTextBetweenTags(page.innerHTML, text);
    console.log('returned', returnedOne);
    page.innerHTML = returnedOne;
    if (checkOverflow(page)) {
      page.innerHTML = prevText;

      remainingText = words.slice(lastAddedWordIndex).join(' ');
      remainingText = ' ' + remainingText; //adding space before text
      remainingText = addOpeningTagsToText(remainingText);
    }
    //remainingText = 'Hello';

    return remainingText;
  };

  const appendToLastPage = (text: string) => {
    page.innerHTML = addTextBetweenTags(page.innerHTML, text);

    return checkOverflow(page);
  };

  const checkOverflow = (el: HTMLElement) => {
    const curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

    const isOverflowing =
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
  };

  const emptyRemainingText = () => {
    remainingText = '';
  };

  return {
    remainingText,
    appendTextEveryNthStep,
    appendToLastPage,
    emptyRemainingText,
  };
}
