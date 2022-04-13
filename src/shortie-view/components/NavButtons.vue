<template>
  <div data-atropos-offset="4" class="card-contents-btns">
    <q-btn
      label="Prev"
      icon="arrow_back"
      outline
      rounded
      :ripple="{ early: true }"
      @click="prevTextBlock"
    />
    <q-btn
      label="Next"
      icon-right="arrow_forward"
      class="next-btn"
      outline
      rounded
      :ripple="{ early: true }"
      @click="nextTextBlock"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import handleTextBlocks from '../composables/textBlockHandler';

export default defineComponent({
  setup() {
    const { prevTextBlock, nextTextBlock } = handleTextBlocks();

    return { prevTextBlock, nextTextBlock };
  },
});
</script>

<style lang="scss" scoped>
.card-contents-btns {
  align-self: end;
  margin-bottom: 40px;

  .next-btn {
    float: right;
  }
}
</style>
