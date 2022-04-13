// import { DOMInterface, Content } from '../interfaces';
// import { getOpeningTag, getClosingTag } from '../composables/utils';

// export default function handlePagination() {
//   const paginateText = (
//     DOM: DOMInterface | Content,
//     textBlocks = <string[]>[]
//   ) => {
//     if (DOM['type'] == 'p') {
//       textBlocks = handleParagraph(DOM, textBlocks);
//     } else if ('contents' in DOM) {
//       textBlocks.push('');
//       const lastIndex = textBlocks.length - 1;

//       const contents = DOM['contents'];

//       for (const content of contents) {
//         if (typeof content == 'string') {
//           textBlocks[lastIndex] = textBlocks[lastIndex] + content;
//         } else {
//           textBlocks = paginateText(content, textBlocks);
//         }
//       }
//     }

//     return textBlocks;
//   };

//   const handleParagraph = (
//     DOM: DOMInterface | Content,
//     textBlocks = <string[]>[]
//   ) => {
//     if ('contents' in DOM) {
//       let lastTextBlock = '';

//       const contents = DOM['contents'];

//       for (const content of contents) {
//         if (typeof content == 'string') {
//           lastTextBlock = lastTextBlock + content;
//         } else {
//           addTextBlock;
//         }
//       }

//       const startTag = getOpeningTag(DOM['type']);
//       const endTag = getClosingTag(DOM['type']);
//       lastTextBlock = startTag + lastTextBlock + endTag;

//       textBlocks.push(lastTextBlock);
//     }

//     return textBlocks;
//   };

//   const addTextBlock = (DOM: DOMInterface | Content, textBlock: string) => {
//     if ('contents' in DOM) {
//       const contents = DOM['contents'];

//       for (const content of contents) {
//         if (typeof content == 'string') {
//           textBlock = textBlock + content;
//         } else {
//           addTextBlock(content, textBlock);
//         }
//       }
//     }

//     const startTag = getOpeningTag(DOM['type']);
//     const endTag = getClosingTag(DOM['type']);
//     textBlock = startTag + textBlock + endTag;

//     return textBlock;
//   };

//   return { paginateText };
// }
