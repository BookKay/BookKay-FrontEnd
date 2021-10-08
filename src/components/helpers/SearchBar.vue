<template>
  <div class="search-container">
    <q-input
      rounded
      outlined
      color="black"
      v-model="currentText"
      label="Search"
      class="input-container"
      @keydown.enter.prevent="$refs.searchBtn.click()"
    />
    <q-btn
      color="black"
      icon="search"
      :ripple="{ early: true }"
      ref="searchBtn"
      class="search-btn"
      @click="this.$emit('search', currentText)"
    />
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    text: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      currentText: this.$props.text,
    };
  },
  methods: {
    updateText(newText) {
      this.currentText = newText;
    },
  },
};
</script>

<style lang="scss" scoped>
.input-container {
  display: inline-block;
  width: 85%;
  margin-right: 20px;
}

.search-btn {
  float: right;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

@media (max-width: 480px) {
  .input-container {
    width: 75%;
  }
}
</style>
