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
//   const { appendToLastPage } = textAppending();

//   const singleTags = ['br', 'hr'];

//   // const paginateText = () => {
//   //   return
//   // }

//   const paginateText = (
//     DOM: DOMInterface | Content,
//     pageNum: number,
//     title: string,
//     currentComponent: Component,
//     tags = <Tag[]>[]
//   ) => {
//     if (
//       'attributes' in DOM &&
//       'id' in DOM['attributes'] &&
//       DOM['attributes']['id'] == 'RootDivContainer'
//     ) {
//       //To ignore the enclosing root container
//     } else {
//       const openingTag =
//         'attributes' in DOM
//           ? getOpeningTag(DOM['type'], DOM['attributes'])
//           : getOpeningTag(DOM['type']);
//       const closingTag = getClosingTag(DOM['type']);

//       let pageText = appendToLastPage(openingTag + closingTag, tags);
//       if (pageText != '') {
//         // checks if word could not be filled in last page
//         currentComponent['pages'].push(pageText);
//         createPage(title, pageText); // create new empty page
//         pageText = appendToLastPage(openingTag + closingTag, tags); // fill the word in the new last element
//       }

//       tags.push({
//         openingTag: openingTag,
//         closingTag: closingTag,
//       });
//     }

//     if ('contents' in DOM) {
//       for (let i = 0; i < DOM['contents'].length; i++) {
//         let content = DOM['contents'][i];

//         //check if content is string(text to render)
//         if (typeof content == 'string') {
//           content = escapeHtml(content);

//           const words = content.split(' ');

//           for (let j = 0; j < words.length; j++) {
//             const word = words[j] + ' ';

//             let pageText = appendToLastPage(word, tags);
//             if (pageText != '') {
//               // checks if word could not be filled in last page
//               currentComponent['pages'].push(pageText);
//               createPage(title, pageText); // create new empty page
//               const lastTags = []; //array to store the tags that have been appended to page

//               //looping through each tags and inserting them in the next page
//               for (let index = 0; index < tags.length; index++) {
//                 const tag = tags[index];

//                 const lastPage = pages[pages.length - 1].text.split(' '); //text of last page

//                 if (
//                   tag['openingTag'].startsWith('<p') &&
//                   lastPage[lastPage.length - 2] != '<p></p>'
//                 ) {
//                   //to prevent the indentation of paragraph when overflowing to the next page
//                   //this is due to the fact that all p tags have automatic text indent thanks to css
//                   pageText = appendToLastPage(
//                     "<p style='text-indent: 0'>" + tag['closingTag'],
//                     lastTags
//                   );
//                 } else {
//                   pageText = appendToLastPage(
//                     tag['openingTag'] + tag['closingTag'],
//                     lastTags
//                   ); // fill the word in the new last element
//                 }

//                 lastTags.push(tag);
//               }

//               pageText = appendToLastPage(word, tags);
//             }
//           }
//         } else if (singleTags.includes(content.type)) {
//           //check if content is a self closing tag
//           const word = '<' + content.type + '/>';
//           let pageText = appendToLastPage(word, tags);

//           if (pageText != '') {
//             // checks if word could not be filled in last page
//             createPage(title, pageText); // create new empty page
//             pageText = appendToLastPage(word, tags);
//           }
//         } else {
//           //if content is an object
//           paginateText(
//             content,
//             pages.length + 1,
//             title,
//             currentComponent,
//             tags
//           );
//           tags.pop();
//         }
//       }
//     }
//     return pages.length;
//   };

//   return { paginateText };
// }
