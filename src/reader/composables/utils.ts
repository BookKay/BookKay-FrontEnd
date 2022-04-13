import { Attribute } from '../interfaces';

export const getOpeningTag = (tagName: string, attributes = <Attribute>{}) => {
  let openingTag = '<' + tagName;
  for (const attribute in attributes) {
    openingTag =
      openingTag + ' ' + attribute + "='" + attributes[attribute] + "'";
  }

  openingTag = openingTag + '>';

  return openingTag;
};

export const getClosingTag = (tagName: string) => {
  return '</' + tagName + '>';
};

export const getNextWordContainingLetter = (
  text: string,
  letter: string,
  startIndex: number
) => {
  //Function to get the word after startIndex that contains the specified letter
  //Can be used to get position of closing paranthesis of a tag
  //Returns the index of the word

  text = text.split(' ').slice(startIndex).join(' ');
  const words = text.split(' ');

  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(letter)) {
      return i + startIndex;
    }
  }

  return -1;
};

export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const nthIndexOf = (string: string, searchString: string, n: number) => {
  const stringLength = string.length;
  let i = -1;

  while (n-- && i++ < stringLength) {
    i = string.indexOf(searchString, i);
    if (i < 0) break;
  }
  return i;
};

export const nthIndexOf1 = (
  string: string,
  searchString: string,
  n: number
) => {
  const words = string.split(' ');

  const position = words.reduce(
    (acc, val, ind) => {
      if (val === searchString) {
        if (acc.count + 1 === n) {
          acc['index'] = ind;
        }
        acc['count']++;
      }
      return acc;
    },
    {
      index: -1,
      count: 0,
    }
  );
  return position.index;
};

export const nthLastIndexOf = (
  string: string,
  searchString: string,
  n: number
): number => {
  if (string === null) {
    return -1;
  }

  if (!n || isNaN(n) || n <= 1) {
    return string.lastIndexOf(searchString);
  }
  n--;

  return string.lastIndexOf(
    searchString,
    nthLastIndexOf(string, searchString, n) - 1
  );
};
