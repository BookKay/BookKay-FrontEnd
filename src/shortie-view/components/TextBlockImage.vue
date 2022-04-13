<template>
  <div class="card-text" v-html="text" data-atropos-offset="4"></div>

  <nav-buttons />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import {
  EmbedImageTextBlockInterface,
  UnsplashImageTextBlockInterface,
} from '../interfaces';
import NavButtons from './NavButtons.vue';

export default defineComponent({
  components: { NavButtons },
  props: {
    textBlock: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const text = ref('');

    onMounted(() => {
      const textBlock = props['textBlock'];
      if ('unsplash' in textBlock) {
        text.value = convertToHTML(
          textBlock as UnsplashImageTextBlockInterface
        );
      } else {
        text.value = convertToHTML(textBlock as EmbedImageTextBlockInterface);
      }
    });

    const convertToHTML = (
      textBlock: EmbedImageTextBlockInterface | UnsplashImageTextBlockInterface
    ) => {
      const url = textBlock['url'];
      const caption = textBlock['caption'];

      const img = `<img src='${url}' alt='${caption}' />`;

      let credits = '';
      if ('unsplash' in textBlock) {
        const author = textBlock['unsplash']['author'];
        const link = textBlock['unsplash']['profileLink'];
        const unsplash_link =
          'https://unsplash.com/?utm_source=8MeSNDcetPzIRf3mcLc-_6rrHYPaZnbo6ZSLcAIFniI&utm_medium=referral';

        credits = `<div class='img-credits'>by <a href='${link}' target='_blank'>${author}</a> on <a href='${unsplash_link}' target='_blank'>Unsplash</a></div>`;
      }
      const img_container = `<div class='img-container'>${img}${credits}</div>`;

      const caption_html = `<div class='img-caption'>${caption}</div>`;

      const img_wrapper = `<div class='img-wrapper'>${img_container}${caption_html}</div>`;

      return img_wrapper;
    };

    return { text };
  },
});
</script>

<style lang="scss" scoped>
.card-text {
  display: grid;
  place-items: center;
  min-height: 100%;
}
</style>
