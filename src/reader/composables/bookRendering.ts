import { reactive } from 'vue';
import { useQuasar } from 'quasar';

import handlePages from './pagesHandler';
import handleNavigations from './navigationHandler';
import handleBookCopy from './bookCopyHandler';
import textPagination from './textPagination';

//Interfaces

import {
  BookJSON,
  ComponentTypeInterface,
  NavigationInterface,
} from '../interfaces';

export default function bookRendering() {
  //Setting up composable functions
  const $q = useQuasar();

  const { paginateText } = textPagination();
  const { pages, createPage } = handlePages();
  const { addNav } = handleNavigations();
  const {
    book_copy,
    addComponent: addComponentToBookCopy,
    addMainText: addMainTextToBookCopy,
  } = handleBookCopy();

  //
  //This is the main function to render book
  const renderBook = (initBook: BookJSON) => {
    const book = reactive(initBook);

    addFirstPage(book);

    //Adding in the front matters
    addComponent(book, 'front_matters');

    //Adding in the chapters
    if ('chapters' in book && book.chapters.length > 0) {
      addComponent(book, 'chapters');
    } else if (book.text != null) {
      addMainText(book);
    }

    //Adding in the back matters
    addComponent(book, 'back_matters');

    //Adding in final blank pages if required
    addFinalPages(book);

    return book;
  };

  const addFirstPage = (book: BookJSON) => {
    //Adding in navigation
    const nav: NavigationInterface = {
      type: 'book',
      data: book['title'],
      page: 1,
      active: false,
    };
    addNav(nav);

    //Adding title and cover urls to the book copy object
    book_copy.title = book.title;
    book_copy.description = book.description;
    book_copy.front_cover = book.front_cover;
    book_copy.back_cover = book.back_cover;

    if ($q.screen.gt.sm) {
      createPage(book['title'], ''); // creates the first page
    }
  };

  const addComponent = (
    book: BookJSON,
    component_type: ComponentTypeInterface
  ) => {
    const components = book[component_type];

    if (Array.isArray(components)) {
      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        //Appending component to book copy
        addComponentToBookCopy(component_type, {
          title: component['title'],
          pages: <string[]>[],
        });

        //Removing the 's'.  [ front_matters => front_matter ]
        const component_type_singular = component_type.slice(0, -1);

        //Adding in navigation
        const nav = <NavigationInterface>{
          type: component_type_singular,
          data: component['title'],
          page: pages.length + 1,
        };

        addNav(nav);

        paginateText(component);

        const page = document.getElementsByClassName('page-text')[0].innerHTML;
        if (page != '') {
          //Adding page to book copy
          //book_copy[component_type][i]['pages'].push(page);

          //Creating page
          createPage(component['title'], page);
          document.getElementsByClassName('page-text')[0].innerHTML = '';
        }
      }
    }
  };

  const addMainText = (book: BookJSON) => {
    //Adding in navigation
    const nav = <NavigationInterface>{
      type: 'text',
      data: book['title'],
      page: pages.length + 1,
    };

    addNav(nav);

    addMainTextToBookCopy({
      title: book['title'],
      pages: [],
    });

    paginateText(book);

    const page = document.getElementsByClassName('page-text')[0].innerHTML;
    if (page != '') {
      //Adding page to book copy
      //book_copy.main_text['pages'].push(page);

      createPage(book['title'], page);
      document.getElementsByClassName('page-text')[0].innerHTML = '';
    }
  };

  const addFinalPages = (book: BookJSON) => {
    if ($q.screen.gt.sm) {
      createPage(book['title'], '');

      if (pages.length % 2 == 1) {
        createPage(book['title'], '');
      }
    }
  };

  return { renderBook };
}
