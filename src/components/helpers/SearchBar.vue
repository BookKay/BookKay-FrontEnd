<template>
  <div class="search-container row">
    <q-input
      rounded
      outlined
      color="black"
      v-model="text"
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
      @click="console.log('hey')"
    />
  </div>
</template>

<script>
export default {
  name: "SearchBar",

  data() {
    return {
      text: "",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.search-container {
}

.input-container {
  display: inline-block;
  width: 80%;
  margin-right: 20px;
}

.search-btn {
  float: right;
  border-radius: 50%;
}

@media (max-width: 480px) {
  .input-container {
    margin-right: 10px;
  }
}

@media (max-width: 380px) {
  .input-container {
    width: 70%;
    margin-right: 5px;
  }
}
</style>
