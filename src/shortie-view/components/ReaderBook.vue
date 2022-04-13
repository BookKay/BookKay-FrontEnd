<template>
  <!-- <div id="background"></div> -->
  <main class="contents">
    <text-card
      v-for="textBlock in textBlocks"
      :key="textBlock.meta.index"
      :currentState="textBlock.meta.state"
      :text="textBlock.text"
      :header="textBlock.meta.header"
      @nextClicked="handleNext"
      @prevClicked="handlePrev"
    >
      <text-block-heading
        v-if="textBlock.type == 'heading'"
        :textBlock="textBlock"
      />
      <text-block-paragraph
        v-else-if="textBlock.type == 'paragraph'"
        :textBlock="textBlock"
      />
      <text-block-image
        v-else-if="textBlock.type == 'image'"
        :textBlock="textBlock"
      />
      <text-block-list
        v-else-if="textBlock.type == 'list'"
        :textBlock="textBlock"
      />
      <text-block-delimiter
        v-else-if="textBlock.type == 'delimiter'"
        :textBlock="textBlock"
      />
    </text-card>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import TextCard from './TextCard.vue';
import TextBlockHeading from './TextBlockHeading.vue';
import TextBlockParagraph from './TextBlockParagraph.vue';
import TextBlockImage from './TextBlockImage.vue';
import TextBlockList from './TextBlockList.vue';
import TextBlockDelimiter from './TextBlockDelimiter.vue';

import handleRequests from '../composables/requestHandler';
import bookRendering from '../composables/bookRendering';
import handleTextBlocks from '../composables/textBlockHandler';

import { BookJSON } from '../interfaces';

export default defineComponent({
  name: 'ShortieView',
  components: {
    TextCard,
    TextBlockHeading,
    TextBlockParagraph,
    TextBlockImage,
    TextBlockList,
    TextBlockDelimiter,
  },
  setup() {
    const route = useRoute();
    const { fetchManuscript, fetchBook } = handleRequests();
    const { renderBook } = bookRendering();
    const { textBlocks, initFirstBlock, nextTextBlock, prevTextBlock } =
      handleTextBlocks();

    const emptyBook = {
      title: '',
      description: '',
      front_cover: '',
      back_cover: '',
      front_matters: [],
      chapters: [],
      back_matters: [],
      text: [],
    };

    const book: BookJSON = reactive(emptyBook);

    onMounted(async () => {
      if (Object.keys(route.query)[0] == 'manuscript_id') {
        let returnedManuscript = await fetchManuscript();

        Object.assign(book, returnedManuscript);
      } else if (Object.keys(route.query)[0] == 'book_id') {
        let returnedBook = await fetchBook();
        Object.assign(book, returnedBook);
      }

      renderBook(book);

      initFirstBlock();
    });

    return { textBlocks, nextTextBlock, prevTextBlock };
  },
});
</script>

<style lang="scss" scoped>
#background {
  //background-color: plum;
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  z-index: -5;
  overflow: hidden;
}

.contents {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;

  //display: flex;

  //align-items: center;
  //justify-content: center;
}
</style>
