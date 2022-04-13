import {
  getOpeningTag,
  getClosingTag,
  getNextWordContainingLetter,
  nthLastIndexOf,
  nthIndexOf,
} from './utils';
import { TagInterface, Attribute } from '../interfaces';

export default function handleTags() {
  const tags: TagInterface[] = [];

  const getTags = (text: string, openingTagIndex: number) => {
    const textList = text.split(' ');
    const tag = textList[openingTagIndex];

    let tagName = tag.slice(1); //Removing '<'
    if (tagName.includes('>')) {
      tagName = tagName.slice(0, tagName.length - 1); //Removing the '>'
    }

    const endParanthesisIndex = tag.indexOf('>');
    if (endParanthesisIndex != -1) {
      tag.slice(0, endParanthesisIndex);
    }

    const attributes = extractAttributes(
      text.split(' ').slice(openingTagIndex).join(' ')
    );

    const openingTag = getOpeningTag(tagName, attributes);

    let closingTag = '';
    if (!checkIfSingleTag(text, openingTagIndex)) {
      closingTag = getClosingTag(tagName);
    }

    return {
      openingTag: openingTag,
      closingTag: closingTag,
    };
  };

  const addTags = (tag: TagInterface) => {
    tags.push(tag);

    return tags;
  };

  const removeTags = () => {
    const tag = tags.pop();

    return tag;
  };

  const getAttribute = (text: string) => {
    if (nthIndexOf(text, '=', 1) != -1) {
      //<p class="text-block bg-green" style="text-align:center">
      //...
      //class
      const equalPos = nthIndexOf(text, '=', 1);
      const spacePos = nthIndexOf(text, ' ', 1);
      const name = text.slice(spacePos + 1, equalPos);

      //<p class="text-block bg-green" style="text-align:center">
      //...
      //text-block bg-green
      const startQuote = nthIndexOf(text, '"', 1);
      const endQuote = nthIndexOf(text, '"', 2);
      const value = text.slice(startQuote + 1, endQuote);

      //<p class="text-block bg-green" style="text-align:center">
      //...
      // style="text-align:center">
      const returnedText = text.slice(endQuote + 1);

      return { name, value, returnedText };
    } else {
      return {};
    }
  };

  const extractAttributes = (text: string) => {
    const attributes: Attribute = {};

    const endIndex = text.indexOf('>');
    text = text.slice(0, endIndex);

    let continueLooping = true;

    while (continueLooping) {
      const { name, value, returnedText } = getAttribute(text);
      text = returnedText as string;

      if (name == undefined) {
        continueLooping = false;
      } else {
        attributes[name] = value;
      }
    }

    return attributes;
  };

  const addTextBetweenTags = (textWithTags: string, textToAdd: string) => {
    //Function that adds text between the tags
    //<div> Hi, <b> I am </b> </div>   ...   'Kevin'   ... tags = [b, div]
    //...
    //<div> Hi, <b> I am Kevin </b> </div>

    //First tag in the tags list
    let firstTag;
    if (tags.length > 0) {
      firstTag = tags[tags.length - 1]['closingTag'];

      let firstTagCount = 1;
      let calls = 0;

      //Counting the time number of first tag appears among the tags
      for (let i = 0; i < tags.length - 1; i++) {
        if (tags[i]['closingTag'] == firstTag) {
          firstTagCount++;
        }
        calls += 1;
        if (calls > 100) {
          debugger;
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

  const addOpeningTagsToText = (text: string) => {
    let calls = 0;
    for (let i = tags.length - 1; i >= 0; i--) {
      const tag = tags[i];
      text = tag.openingTag + text;

      calls += 1;
      if (calls > 100) {
        debugger;
      }
    }

    return text;
  };

  const addClosingTagsToText = (text: string) => {
    for (let i = tags.length - 1; i >= 0; i--) {
      const tag = tags[i];
      text = text + tag.closingTag;
    }

    return text;
  };

  const checkIfSingleTag = (text: string, startIndex: number) => {
    const index = getNextWordContainingLetter(text, '>', startIndex);
    const word = text.split(' ')[index];

    const isSingleTag = word[word.length - 2] == '/'; //Check if second last character is /

    return isSingleTag;
  };

  return {
    tags,
    getTags,
    addTags,
    removeTags,
    addTextBetweenTags,
    addOpeningTagsToText,
    addClosingTagsToText,
  };
}
