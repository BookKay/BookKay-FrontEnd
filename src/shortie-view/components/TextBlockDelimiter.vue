<template>
  <div class="card-text" v-html="text" data-atropos-offset="4"></div>

  <nav-buttons />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
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
      text.value = convertToHTML();
    });

    const convertToHTML = () => {
      const html = "<div class='delimiter'></div>";

      return html;
    };

    return { text };
  },
});
</script>
