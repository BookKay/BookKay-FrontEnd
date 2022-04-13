<template>
  <div class="card-text" v-html="text" data-atropos-offset="6"></div>

  <nav-buttons />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { HeadingTextBlockInterface } from '../interfaces';
import handleTextBlocks from '../composables/textBlockHandler';
import NavButtons from './NavButtons.vue';

export default defineComponent({
  components: { NavButtons },
  props: {
    textBlock: {
      type: Object,
    },
  },
  setup(props) {
    const { nextTextBlock } = handleTextBlocks();

    const text = ref('');

    onMounted(() => {
      text.value = convertToHTML(
        props['textBlock'] as HeadingTextBlockInterface
      );
    });

    const convertToHTML = (textBlock: HeadingTextBlockInterface) => {
      const data = textBlock.data;
      const tunes = textBlock.tunes;

      const level = data['level'];
      const tag = `h${level}`;

      const text = data['text'];

      const alignment = tunes['alignment']['alignment'];
      const alignment_text = 'text-align: ' + alignment + ';';

      const html = `<${tag} style='${alignment_text}'>${text}</${tag}>`;

      return html;
    };

    return { text, nextTextBlock };
  },
});
</script>
<style lang="scss" scoped>
.card-text {
  display: grid;
  place-items: center;
  min-height: 100%;

  ::v-deep(h1) {
    font-size: 5em;
    font-weight: 500;
    margin-top: 0;
  }

  ::v-deep(h2) {
    font-size: 3.75em;
    font-weight: 500;
    margin-top: 0;
  }

  ::v-deep(h3) {
    font-size: 3em;
    font-weight: 500;
  }

  ::v-deep(h4) {
    font-size: 2em;
    font-weight: 300;
  }

  ::v-deep(h5) {
    font-size: 1.5em;
  }

  ::v-deep(h6) {
    font-size: 1.25em;
  }
}
</style>
