import { reactive } from 'vue';
import { useQuasar } from 'quasar';

import handlePages from './pagesHandler';
import handleNavigations from './navigationHandler';

import { ComponentTypeInterface, NavigationInterface } from '../interfaces';

interface BookCopy {
  title: string;
  description: string;
  front_cover: string;
  back_cover: string;
  front_matters: Component[];
  chapters: Component[];
  main_text: MainText;
  back_matters: Component[];
}

interface Component {
  title: string;
  pages: string[];
}

interface MainText {
  title: string;
  pages: string[];
}

const empty_book_copy: BookCopy = {
  title: '',
  description: '',
  front_cover: '',
  back_cover: '',
  front_matters: [],
  main_text: { title: '', pages: [] },
  chapters: [],
  back_matters: [],
};
const book_copy = reactive(empty_book_copy);
let currentComponentType = <
  'front_matters' | 'chapters' | 'main_text' | 'back_matters'
>'chapters';
let currentComponentNum = 0;

export default function handleBookCopy() {
  //Initialising the imported composables
  const $q = useQuasar();

  const { pages, createPage } = handlePages();
  const { addNav } = handleNavigations();

  const addComponent = (
    component_type: ComponentTypeInterface,
    component: Component
  ) => {
    const property = book_copy[component_type as keyof BookCopy];

    if (Array.isArray(property)) {
      property.push(component);
      updateCurrentComponent(component_type, property.length);
    }
  };

  const addMainText = (text: MainText) => {
    book_copy['main_text'] = text;

    updateCurrentComponent('main_text', 0);
  };

  const clearBookCopy = () => {
    book_copy.front_matters.length = 0;
    book_copy.chapters.length = 0;
    book_copy.main_text['title'] = '';
    book_copy.main_text['pages'].length = 0;
    book_copy.back_matters.length = 0;
  };

  const updateCurrentComponent = (
    componentType: 'front_matters' | 'chapters' | 'main_text' | 'back_matters',
    componentNum: number
  ) => {
    currentComponentType = componentType;
    currentComponentNum = componentNum;
  };

  const addPageToCurrentComponent = (text: string) => {
    let currentComponent;
    if (currentComponentType == 'main_text') {
      currentComponent = book_copy[currentComponentType];
    } else {
      currentComponent =
        book_copy[currentComponentType][currentComponentNum - 1];
    }

    currentComponent.pages.push(text);
  };

  //All the functions below are for loading the book copy to render
  const loadBookCopy = (book: BookCopy) => {
    addFirstPage(book);

    //Adding in the front matters
    addComponentToRender(book, 'front_matters');

    //Adding in the chapters
    if ('chapters' in book && book.chapters.length > 0) {
      addComponentToRender(book, 'chapters');
    } else if (book.main_text != null) {
      addMainTextToRender(book);
    }

    //Adding in the back matters
    addComponentToRender(book, 'back_matters');

    //Adding in final blank pages if required
    addFinalPages(book);

    return book;
  };

  const addFirstPage = (book: BookCopy) => {
    //Adding in navigation
    const nav: NavigationInterface = {
      type: 'book',
      data: book['title'],
      page: 1,
      active: false,
    };
    addNav(nav);

    if ($q.screen.gt.sm) {
      createPage(book['title'], ''); // creates the first page
    }
  };

  const addComponentToRender = (
    book: BookCopy,
    component_type: ComponentTypeInterface
  ) => {
    const components = book[component_type];
    for (const component of components) {
      //Removing the 's'.  [ front_matters => front_matter ]
      const component_type_singular = component_type.slice(0, -1);

      //Adding in navigation
      const nav = <NavigationInterface>{
        type: component_type_singular,
        data: component['title'],
        page: pages.length + 1,
      };
      addNav(nav);

      //Creating page
      for (const page of component['pages']) {
        createPage(component['title'], page);
      }
    }
  };

  const addMainTextToRender = (book: BookCopy) => {
    const main_text = book['main_text'];
    //Creating pages
    for (const page of main_text['pages']) {
      createPage(main_text['title'], page);
    }
  };

  const addFinalPages = (book: BookCopy) => {
    //Function to add blank pages at the end of the book
    if ($q.screen.gt.sm) {
      createPage(book['title'], '');

      if (pages.length % 2 == 1) {
        createPage(book['title'], '');
      }
    }
  };

  return {
    book_copy,
    addComponent,
    addMainText,
    clearBookCopy,
    addPageToCurrentComponent,
    loadBookCopy,
  };
}
