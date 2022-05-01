<template>
  <q-dialog ref="dialog" v-model="isOpen">
    <q-card class="card">
      <q-card-section>
        <div class="text-h6">{{ header }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ text }}
        <slot name="main-content"> </slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          :ripple="{ early: true }"
          @click="handleCancel"
        />
        <q-btn
          flat
          :label="btnLabel"
          :color="btnColor"
          :ripple="{ early: true }"
          :loading="isLoading"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AppConfirmDialog',
  props: {
    open: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    btnLabel: {
      type: String,
      default: '',
    },
    btnColor: {
      type: String,
      default: 'warning',
    },
  },

  computed: {
    isOpen() {
      return this.$props.open;
    },
    isLoading() {
      return this.$props.loading;
    },
  },

  data() {
    return {
      // isOpen: this.$props.open,
    };
  },
  methods: {
    handleConfirm() {
      this.$emit('confirmed', true);
    },
    handleCancel() {
      this.$emit('confirmed', false);
    },
  },
};
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
