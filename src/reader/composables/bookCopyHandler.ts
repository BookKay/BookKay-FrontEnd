import { reactive } from 'vue';

import { ComponentType } from 'src/reader/interfaces';

interface BookCopy {
  title: string;
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

const initial_book_copy: BookCopy = {
  title: '',
  front_cover: '',
  back_cover: '',
  front_matters: [],
  main_text: { title: '', pages: [] },
  chapters: [],
  back_matters: [],
};
const book_copy = reactive(initial_book_copy);

export default function handleBookCopy() {
  const addComponent = (
    component_type: ComponentType,
    component: Component
  ) => {
    const property = book_copy[component_type as keyof BookCopy];

    if (Array.isArray(property)) {
      property.push(component);
    }
  };

  const addMainText = (text: MainText) => {
    book_copy['main_text'] = text;
  };

  const clearBookCopy = () => {
    book_copy.front_matters.length = 0;
    book_copy.chapters.length = 0;
    book_copy.main_text['title'] = '';
    book_copy.main_text['pages'].length = 0;
    book_copy.back_matters.length = 0;
  };

  return {
    book_copy,
    addComponent,
    addMainText,
    clearBookCopy,
  };
}
