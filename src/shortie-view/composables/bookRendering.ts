import { reactive } from 'vue';

import {
  BookJSON,
  ComponentTypeInterface,
  BaseTextBlockInterface,
  TextBlockStateInterface,
} from '../interfaces';

import { titleCase } from './utils';
import handleTextBlocks from '../composables/textBlockHandler';

export default function bookRendering() {
  const { addTextBlock } = handleTextBlocks();

  const renderBook = (initialBook: BookJSON) => {
    const book = reactive(initialBook);

    let textBlocks = <BaseTextBlockInterface[]>[];

    //Adding in front matters
    textBlocks = addComponent(book, 'front_matters', textBlocks);

    //Adding in the chapters
    if ('chapters' in book && book.chapters.length > 0) {
      textBlocks = addComponent(book, 'chapters', textBlocks);
    } else if (book.text != null) {
      textBlocks = addMainText(book, textBlocks);
    }

    //Adding in the back matters
    textBlocks = addComponent(book, 'back_matters', textBlocks);

    return textBlocks;
  };

  const addComponent = (
    book: BookJSON,
    component_type: ComponentTypeInterface,
    textBlocks: BaseTextBlockInterface[]
  ) => {
    const components = book[component_type];

    if (Array.isArray(components)) {
      for (let i = 0; i < components.length; i++) {
        const component = components[i];

        const newTextBlocks = component['text'];
        for (let j = 0; j < newTextBlocks.length; j++) {
          const textBlock = newTextBlocks[j];

          //Converting front_matters => Front Matter - 1
          let header = component_type.slice(0, -1); //front_matters => front_matter
          header = header.replace('_', ' ');
          header = titleCase(header);
          header = header + ` - ${i + 1}`;

          const meta = {
            index: j,
            header: header,
            state: <TextBlockStateInterface>'notShown',
          };
          textBlock.meta = meta;

          addTextBlock(textBlock);
        }
      }
    }

    return textBlocks;
  };

  const addMainText = (
    book: BookJSON,
    textBlocks: BaseTextBlockInterface[]
  ) => {
    const mainText = book['text'];

    for (let i = 0; i < mainText.length; i++) {
      const textBlock = mainText[i];

      const header = book['title'];

      const meta = {
        index: i,
        header: header,
        state: <TextBlockStateInterface>'notShown',
      };
      textBlock.meta = meta;

      addTextBlock(textBlock);
    }

    return textBlocks;
  };

  return { renderBook };
}
