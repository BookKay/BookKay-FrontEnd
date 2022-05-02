// import handlePages from './pagesHandler';
// import textAppending from './textAppending';

// import { getOpeningTag, getClosingTag, escapeHtml } from './utils';
// import { DOMInterface, Content } from '../interfaces';

// interface Component {
//   pages: string[];
// }

// interface Tag {
//   openingTag: string;
//   closingTag: string;
// }

// export default function textPagination() {
//   const { pages, createPage } = handlePages();
//   const { appendToText, appendToLastPage } = textAppending();

//   const singleTags = ['br', 'hr'];
//   const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page

//   const tags = <Tag[]>[]; //A stack to store the html tags

//   const createTextBlocks = (
//     DOM: DOMInterface | Content,
//     textBlocks = <string[]>[],
//     lastIndex = -1
//   ): string[] => {
//     //Function to add all recurring texts inside each of the content

//     if ('contents' in DOM) {
//       const contents = DOM['contents'];
//       if (lastIndex >= 0) {
//         {
//           contents.slice(lastIndex);
//         }
//       }

//       //Initialising the text blocks if it is empty
//       if (textBlocks.length == 0) {
//         for (let i = 0; i < contents.length; i++) {
//           textBlocks[i] = '';
//         }
//       }

//       let index = 0;
//       console.log(contents);

//       for (const content of contents) {
//         if (typeof content == 'string') {
//           textBlocks.push(content);
//         } else {
//           textBlocks = addTextBlock(content, textBlocks, index);
//         }

//         index++;
//       }
//     }
//     console.log('text blocks created: ', textBlocks);
//     return textBlocks;
//   };

//   const addTextBlock = (
//     DOM: DOMInterface | Content,
//     textBlocks: string[],
//     index: number
//   ) => {
//     if ('contents' in DOM) {
//       const contents = DOM['contents'];

//       for (const content of contents) {
//         if (typeof content == 'string') {
//           textBlocks[index] = textBlocks[index] + content;
//         } else {
//           textBlocks = addTextBlock(content, textBlocks, index);
//         }
//       }

//       const startTag = getOpeningTag(DOM['type']);
//       const endTag = getClosingTag(DOM['type']);
//       textBlocks[index] = startTag + textBlocks[index] + endTag;
//     }

//     return textBlocks;
//   };

//   const paginateText = (
//     DOM: DOMInterface | Content,
//     title = '',
//     currentComponent: Component,
//     textBlocks = <string[]>[],
//     lastIndex = -1,
//     originalText = ''
//   ) => {
//     if (textBlocks.length == 0) {
//       textBlocks = createTextBlocks(DOM, [], lastIndex);
//     }

//     const startTag = getOpeningTag(DOM['type']);
//     const endTag = getClosingTag(DOM['type']);

//     page.innerHTML = startTag + originalText + textBlocks.join('') + endTag;

//     // if (checkOverflow(page) ) {
//     //   //If overflowing

//     //   let extra = '';

//     //   if (originalText != '') {
//     //     page.innerHTML = originalText;
//     //     while (checkOverflow(page)) {
//     //       //temporary implementation

//     //       const tag = {
//     //         openingTag: getOpeningTag(DOM['type']),
//     //         closingTag: getClosingTag(DOM['type']),
//     //       };
//     //       tags.push(tag);

//     //       let isPageFull = false;

//     //       for (const word of originalText) {
//     //         if (!isPageFull) {
//     //           const extraText = appendToLastPage(word, tags);
//     //           if (extraText != '') {
//     //             isPageFull = true;
//     //             currentComponent['pages'].push(extraText);
//     //             createPage(title, extraText);
//     //           }
//     //         } else {
//     //           extra = extra + word;
//     //         }
//     //       }

//     //       page.innerHTML = startTag + extra + endTag;
//     //     }
//     //   }

//     //   let prevAddedText;

//     //   originalText = appendToText(originalText, extra, tags);

//     //   let lastIndex = 0;
//     //   for (let i = 0; i < textBlocks.length; i++) {
//     //     prevAddedText = originalText;

//     //     const textBlock = textBlocks[i];
//     //     originalText = originalText + textBlock;

//     //     page.innerHTML = startTag + originalText + endTag;

//     //     if (checkOverflow(page)) {
//     //       originalText = prevAddedText;

//     //       const originalTextWithTags = startTag + originalText + endTag;
//     //       const tag = {
//     //         openingTag: getOpeningTag(DOM['type']),
//     //         closingTag: getClosingTag(DOM['type']),
//     //       };
//     //       tags.push(tag);

//     //       if ('contents' in DOM) {
//     //         const content = DOM['contents'][i];

//     //         if (typeof content == 'string') {
//     //           for (const word of content) {
//     //             let isPageFull = false;
//     //             if (!isPageFull) {
//     //               const extraText = appendToLastPage(word, tags);
//     //               if (extraText != '') {
//     //                 currentComponent['pages'].push(extraText);
//     //                 createPage(title, extraText);
//     //                 isPageFull = true;
//     //               }
//     //             } else {
//     //               extra = extra + content;
//     //             }
//     //           }

//     //           originalText = '';
//     //         } else {
//     //           console.log(i);
//     //           console.log(DOM['contents']);

//     //           paginateText(
//     //             content,
//     //             title,
//     //             currentComponent,
//     //             [],
//     //             -1,
//     //             originalTextWithTags
//     //           );
//     //         }
//     //       }

//     //       tags.pop();

//     //       console.log('breaked');
//     //       lastIndex = i;
//     //       break;
//     //     }
//     //   }

//     //   console.log(lastIndex);
//     //   if ('contents' in DOM) {
//     //     const remainingContents = DOM['contents'].slice(lastIndex);
//     //     const remainingTextBlocks = textBlocks.slice(lastIndex);
//     //     remainingTextBlocks.unshift(extra);
//     //     paginateText(
//     //       DOM,
//     //       title,
//     //       currentComponent,
//     //       remainingTextBlocks,
//     //       lastIndex
//     //     );
//     //   }
//     // }

//     return;
//   };

//   const paginateWords = (content: string, addedText: string) => {
//     //Loop through each word
//     const words = content.split(' ');

//     let extraWords = '';
//     let isPageFull = false;

//     for (const word of words) {
//       if (!isPageFull) {
//         appendToLastPage(word, tags);

//         if (checkOverflow(page)) {
//           isPageFull = true;
//         }
//       } else {
//         extraWords = extraWords + word;
//       }
//     }
//     return { addedText, extraWords };
//   };

//   const checkOverflow = (el: HTMLElement) => {
//     const curOverflow = el.style.overflow;

//     if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

//     const isOverflowing =
//       el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

//     el.style.overflow = curOverflow;

//     return isOverflowing;
//   };

//   return { paginateText };
// }
