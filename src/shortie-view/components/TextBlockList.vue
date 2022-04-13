<template>
  <div class="card-text" v-html="text" data-atropos-offset="4"></div>

  <nav-buttons />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { ListTextBlockInterface, ListItemInterface } from '../interfaces';
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
      text.value = convertToHTML(props['textBlock'] as ListTextBlockInterface);
    });

    const convertToHTML = (textBlock: ListTextBlockInterface) => {
      const data = textBlock.data;
      const items = data['items'];
      const style = data['style'];

      const tag = style == 'unordered' ? 'ul' : 'ol';

      const innerHtml = list2html(items, tag);

      const html = `<${tag}>${innerHtml}</${tag}>`;

      return html;
    };

    const list2html = (items: ListItemInterface[], tag: 'ul' | 'ol') => {
      let html = '';
      for (const item of items) {
        const children = list2html(item['items'], tag);
        let item_html;

        if (children) {
          item_html = `<li>${item['content']}<${tag}>${children}</${tag}></li>`;
        } else {
          item_html = `<li>${item['content']}</li>`;
          html = html + item_html;
        }
      }

      return html;
    };

    return { text };
  },
});
</script>

<style lang="scss" scoped>
.card-text {
  display: grid;
  min-height: 100%;
}
</style>
