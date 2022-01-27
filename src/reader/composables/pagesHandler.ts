import { reactive, readonly } from 'vue';

interface Page {
  header: string;
  pageNum: number;
  text: string;
}

const pages = reactive(<Page[]>[]);

export default function handlePages() {
  const createPage = (pageNum: number, header: string, text: string) => {
    const page: Page = {
      header: header,
      pageNum: pages.length,
      text: text,
    };

    pages.push(page);
  };

  const clearPages = () => {
    pages.length = 0;
  };

  return { pages: readonly(pages), createPage, clearPages };
}

// export default () => {
//   const createPage = (pageNum: number, header: string, text: string) => {
//     const page: Page = {
//       header: header,
//       pageNum: pageNum,
//       text: text,
//     };

//     pages.push(page);
//   };

//   return { pages: readonly(pages), createPage };
// };
