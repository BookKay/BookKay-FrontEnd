<template>
  <div>
    <q-card
      rounded
      class="q-ma-sm relative-position type-card"
      v-ripple
      @click="confirmType"
      :class="$props.bookType.chosen ? 'bg-grey-4' : ''"
    >
      <div class="absolute-top-right">
        <q-btn
          icon="info"
          flat
          rounded
          padding="none"
          @click="show_hint = true"
        />
      </div>
      <div class="absolute-center">{{ bookType.name }}</div>
    </q-card>

    <q-dialog v-model="show_hint">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ bookType.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          {{ bookType.hint }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "BookTypeChoices",
  props: {
    bookType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show_hint: false,
    };
  },
  methods: {
    confirmType() {
      if (this.show_hint == true) {
        return;
      } else {
        this.$emit("typeConfirmed", this.$props.bookType.configs);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.type-card {
  width: 150px;
  max-width: 20vw;
  height: 150px;
  max-height: 20vw;
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
}
</style>
