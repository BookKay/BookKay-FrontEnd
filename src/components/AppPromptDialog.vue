<template>
  <q-dialog v-model="isOpen" ref="dialog" persistent>
    <q-card class="card">
      <q-card-section>
        <div class="text-h6">{{ label }}</div>
        <div class="text-subtitle1 q-mt-md" v-html="caption"></div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          ref="input"
          v-model="currentValue"
          :rules="rules"
          autofocus
          lazy-rules="ondemand"
          @keyup.enter="handleConfirm"
          @focus="isChanged = true"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Cancel"
          :ripple="{ early: true }"
          @click="handleCancel"
        />
        <q-btn
          flat
          label="Confirm"
          :ripple="{ early: true }"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AppPromptDialog",
  props: {
    open: {
      type: Boolean,
    },
    label: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    rules: {},
  },
  computed: {
    isOpen() {
      return this.$props.open;
    },

    currentValue: {
      // getter
      get: function () {
        if (!this.isChanged) {
          this.updateNewValue();
          return this.$props.value;
        } else {
          return this.newValue;
        }
      },
      // setter
      set: function (newValue) {
        this.newValue = newValue;
      },
    },
  },

  data() {
    return {
      newValue: this.$props.value,
      isChanged: false,
    };
  },

  methods: {
    handleConfirm() {
      const input = this.$refs.input;
      input.validate();

      if (!input.hasError) {
        this.isChanged = false;
        this.$emit("confirmed", this.newValue);
      } else {
        input.focus();
      }
    },
    handleCancel() {
      this.isChanged = false;
      this.currentValue = this.$props.value;
      this.$emit("confirmed", false);
    },
    updateNewValue() {
      this.newValue = this.$props.value;
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
