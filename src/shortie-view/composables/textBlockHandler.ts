import { ref, reactive } from 'vue';

import { BaseTextBlockInterface } from '../interfaces';

const currentIndex = ref(0);
const textBlocks: BaseTextBlockInterface[] = reactive([]);

export default function handleTextBlocks() {
  const addTextBlock = (textBlock: BaseTextBlockInterface) => {
    textBlocks.push(textBlock);
  };

  const initFirstBlock = () => {
    textBlocks[0].meta.state = 'showing';
  };

  const nextTextBlock = () => {
    if (currentIndex.value != textBlocks.length - 1) {
      currentIndex.value++;

      const prevTextBlock = textBlocks.find(
        (o) => o.meta.index === currentIndex.value - 1
      );
      if (prevTextBlock != undefined) {
        prevTextBlock.meta.state = 'shown';
      }

      const currentTextBlock = textBlocks.find(
        (o) => o.meta.index === currentIndex.value
      );
      if (currentTextBlock != undefined) {
        currentTextBlock.meta.state = 'showing';
      }
    }
  };

  const prevTextBlock = () => {
    if (currentIndex.value != 0) {
      currentIndex.value--;

      const prevTextBlock = textBlocks.find(
        (o) => o.meta.index === currentIndex.value + 1
      );
      if (prevTextBlock != undefined) {
        prevTextBlock.meta.state = 'notShown';
      }

      const currentTextBlock = textBlocks.find(
        (o) => o.meta.index === currentIndex.value
      );
      if (currentTextBlock != undefined) {
        currentTextBlock.meta.state = 'showing';
      }
    }
  };

  return {
    textBlocks,
    initFirstBlock,
    addTextBlock,
    nextTextBlock,
    prevTextBlock,
  };
}
