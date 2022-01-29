import { reactive } from 'vue';
import { useQuasar } from 'quasar';

import handlePages from 'src/reader/composables/pagesHandler';
import handleNavigations from 'src/reader/composables/navigationHandler';
import handleBookCopy from 'src/reader/composables/bookCopyHandler';
import textPagination from './textPagination';

//Interfaces

import { DOMInterface } from 'src/reader/interfaces';
import { ComponentType } from 'src/reader/interfaces';

interface BookJSON {
  title: string;
  front_cover: string;
  back_cover: string;
  front_matters: Component[];
  chapters: Component[];
  text: DOMInterface;
  back_matters: Component[];
}

interface NavigationJSON {
  type: 'book' | 'front_matter' | 'chapter' | 'text' | 'back_matter';
  data: string;
  page: number;
  active: boolean;
}

interface Component {
  title: string;
  text: DOMInterface;
}

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
    const nav: NavigationJSON = {
      type: 'book',
      data: book['title'],
      page: 1,
      active: false,
    };
    addNav(nav);

    //Adding title and cover urls to the book copy object
    book_copy.title = book.title;
    book_copy.front_cover = book.front_cover;
    book_copy.back_cover = book.back_cover;

    if ($q.screen.gt.sm) {
      createPage(book['title'], ''); // creates the first page
    }
  };

  const addComponent = (
    book: BookJSON,

    component_type: ComponentType
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
        const nav = <NavigationJSON>{
          type: component_type_singular,
          data: component['title'],
          page: pages.length + 1,
        };

        addNav(nav);

        paginateText(
          component['text'],
          pages.length + 1,
          component['title'],
          book_copy[component_type][i]
        );

        const page = document.getElementsByClassName('page-text')[0].innerHTML;
        if (page != '') {
          //Adding page to book copy
          book_copy[component_type][i]['pages'].push(page);

          //Creating page
          createPage(component['title'], page);
          document.getElementsByClassName('page-text')[0].innerHTML = '';
        }
      }
    }
  };

  const addMainText = (book: BookJSON) => {
    //Adding in navigation
    const nav = <NavigationJSON>{
      type: 'text',
      data: book['title'],
      page: pages.length + 1,
    };

    addNav(nav);

    addMainTextToBookCopy({
      title: book['title'],
      pages: [],
    });

    paginateText(
      book['text'],
      pages.length + 1,
      book['title'],
      book_copy['main_text']
    );

    const page = document.getElementsByClassName('page-text')[0].innerHTML;
    if (page != '') {
      //Adding page to book copy
      book_copy.main_text['pages'].push(page);

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
