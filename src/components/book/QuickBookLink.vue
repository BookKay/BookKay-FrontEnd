<template>
  <div
    v-ripple.early
    class="container relative-position"
    @click="$emit('btnClicked', book)"
  >
    <div class="main-contents">
      <div class="q-ma-md main-text">
        <div class="col">
          <p class="title ellipsis">{{ book.title }}</p>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ book.title }}
          </q-tooltip>
        </div>
        <p class="author-name ellipsis">{{ book.author_name }}</p>
      </div>
      <div class="col">
        <img
          :src="book.front_cover != '' ? book.front_cover : book.temp_cover"
          class="front-cover q-my-xs"
        />
      </div>
    </div>
    <div class="progress-bar">
      <q-linear-progress :value="0.5" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  name: "QuickBookLink",

  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.container {
  width: 80vw;
  height: 73px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  cursor: pointer;
  position: relative;
}

.main-contents {
  display: flex;
  align-items: center;
  height: 70px;
}

.main-text {
  margin-left: 30px;
}

.title {
  font-weight: bold;
  font-size: 20px;
  width: 60vw;
  padding: 0;
  margin: 0;
}

.author-name {
  font-size: 18px;
  color: #808080;
  font-weight: 300;
  padding: 0;
  margin: 0;
}

.front-cover {
  background-size: contain;
  background-repeat: no-repeat;
  height: 90px;
  width: 90px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  position: relative;
  float: right;
  top: -30px;
  right: 20px;
}

.progress-bar {
  margin: 0 2.3vw;
}

@media (max-width: 480px) {
  .container {
    width: 90vw;
  }

  .front-cover {
    top: -15px;
    right: 10px;
    height: 70px;
    width: 70px;
  }

  .progress-bar {
    margin: 0 8vw;
  }
}
</style>
