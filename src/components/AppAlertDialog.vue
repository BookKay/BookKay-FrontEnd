<template>
  <q-dialog ref="dialog" v-model="isOpen">
    <q-card class="card">
      <q-card-section>
        <div class="text-h6">{{ header }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <slot name="main-content"> </slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="btnLabel"
          :color="btnColor"
          :ripple="{ early: true }"
          @click="closeDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    header: {
      type: String,
      default: '',
    },
    btnLabel: {
      type: String,
      default: 'Close',
    },
    btnColor: {
      type: String,
      default: 'primary',
    },
  },
  setup(props, context) {
    const isOpen = ref(false);

    const openDialog = () => {
      isOpen.value = true;
    };

    const closeDialog = () => {
      isOpen.value = false;
      context.emit('close');
    };

    return { isOpen, openDialog, closeDialog };
  },
});
</script>
<style lang="scss" scoped>
.card {
  min-width: 350px;
}

@media (max-width: 330px) {
  .card {
    min-width: 300px;
  }
}
</style>
