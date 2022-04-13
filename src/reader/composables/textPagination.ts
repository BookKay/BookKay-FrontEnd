import { extend } from 'quasar';

import handlePages from './pagesHandler';
import textAppending from './textAppending';
import handleBlocks from './blocksHandler';

import { Component, BaseTextBlockInterface, BookJSON } from '../interfaces';

export default function textPagination() {
  const { createPage } = handlePages();
  const { remainingText, appendTextEveryNthStep, emptyRemainingText } =
    textAppending();
  const { convertTextBlockToHTML } = handleBlocks();

  const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page

  const paginateText = (component: Component | BookJSON) => {
    const clonedComponent: Component = extend(true, {}, component);

    const title = clonedComponent.title;
    const text = clonedComponent.text;

    let index = 0;

    while (index < text.length) {
      if (remainingText != '') {
        createPage(title, page.innerHTML);
        page.innerHTML = '';

        //const html = convertTextBlockToHTML(prevTextBlock);
        page.innerHTML += remainingText;

        if (checkOverflow(page)) {
          page.innerHTML = '';

          handleOverflow(remainingText, title);
        }

        emptyRemainingText();
      } else {
        const html = convertTextBlockToHTML(text[index]);

        const prevInnerHTML = page.innerHTML;
        page.innerHTML = page.innerHTML + html;

        if (checkOverflow(page)) {
          page.innerHTML = prevInnerHTML;

          handleOverflow(html, title);
        }

        emptyRemainingText();
        index++;
      }
    }
  };

  const handleOverflow = (
    textBlock: BaseTextBlockInterface | string,
    title: string
  ) => {
    //Function that would handle overflow text
    //It would disctate the steps to handle overflow

    //initialising text
    let text = textBlock;
    if (typeof textBlock != 'string') {
      text = convertTextBlockToHTML(textBlock);
    }

    console.log('text - ', text);

    //steps
    appendTextEveryNthStep(text as string, 1);
    // if (remainingText != '') {
    //   appendTextEveryNthStep(remainingText, 1);
    //   const fullPageText = page.innerHTML;

    //   createPage(title, fullPageText);
    //   page.innerHTML = '';
    // }

    return remainingText;
  };

  const checkOverflow = (el: HTMLElement) => {
    const curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

    const isOverflowing =
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
  };

  return { paginateText };
}
