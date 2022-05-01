import { extend } from 'quasar';

import handlePages from './pagesHandler';
import handleBookCopy from './bookCopyHandler';
import textAppending from './textAppending';
import handleTags from './tagsHandler';
import handleBlocks from './blocksHandler';
import mapDOM from './DOMMapper';

import {
  Component,
  BaseTextBlockInterface,
  BookJSON,
  DOMInterface,
} from '../interfaces';

export default function textPagination() {
  const { createPage } = handlePages();
  const { addPageToCurrentComponent } = handleBookCopy();
  const { appendTextToLastPage, emptyRemainingText } = textAppending();
  let { remainingText } = textAppending();
  const { clearTags } = handleTags();
  const { convertTextBlockToHTML } = handleBlocks();
  const { HTML2DOM } = mapDOM();

  const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page

  const paginateText = (component: Component | BookJSON) => {
    const clonedComponent: Component = extend(true, {}, component);

    const title = clonedComponent.title;
    const text = clonedComponent.text;

    let index = 0;

    while (index < text.length) {
      if (remainingText != ' ') {
        //If there is remaining text from previous page, we adds it
        //and check if it is overflowing too

        page.innerHTML += remainingText;

        if (checkOverflow(page)) {
          page.innerHTML = '';

          handleOverflow(remainingText, title);
        }

        //Emptying back the remaining text

        remainingText = ' ';
      } else {
        const html = convertTextBlockToHTML(text[index]);

        const prevInnerHTML = page.innerHTML;
        page.innerHTML = page.innerHTML + html;

        if (checkOverflow(page)) {
          page.innerHTML = prevInnerHTML;
          emptyRemainingText();

          handleOverflow(html, title);

          createPage(title, page.innerHTML);
          //Adding to current component
          addPageToCurrentComponent(page.innerHTML);
          page.innerHTML = '';
        }

        index++;
      }
    }

    //Adding in the last page if there is still any remaining text
    if (remainingText != ' ') {
      page.innerHTML += remainingText;
      createPage(title, page.innerHTML);
      //Adding to current component
      addPageToCurrentComponent(page.innerHTML);

      page.innerHTML = '';

      remainingText = ' ';
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

    text = addTabs(text as string);

    const DOM = <DOMInterface>HTML2DOM(text, false);

    clearTags();
    remainingText = appendTextToLastPage(DOM);
    //removeTabs(remainingText);
  };

  const addTabs = (text: string) => {
    return text.replace(/&nbsp;/g, '');
    //return text.replace(/&nbsp;/g, '<span class="tab"></span>');
  };

  const removeTabs = (text: string) => {
    return text.replace(new RegExp('<span class="tab"></span>', 'g'), '&nbsp;');
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
