<template>
  <div class="card-text" v-html="text" data-atropos-offset="4"></div>

  <nav-buttons />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { ParagraphTextBlockInterface } from '../interfaces';
import NavButtons from './NavButtons.vue';

export default defineComponent({
  components: { NavButtons },
  props: {
    textBlock: {
      type: Object,
    },
  },
  setup(props) {
    const text = ref('');

    onMounted(() => {
      text.value = convertToHTML(
        props['textBlock'] as ParagraphTextBlockInterface
      );
    });

    const convertToHTML = (textBlock: ParagraphTextBlockInterface) => {
      const data = textBlock.data;
      const tunes = textBlock.tunes;
      const tag = 'p';

      const text = data['text'];
      const alignment = tunes['alignment']['alignment'];
      const alignment_text = 'text-align: ' + alignment + ';';

      const html = `<${tag} style='${alignment_text}'>${text}</${tag}>`;

      return html;
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

  ::v-deep(p) {
    font-size: 1.4em;
    font-weight: 430;
  }
}
</style>
