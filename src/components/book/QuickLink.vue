<template>
  <div
    v-ripple.early
    class="container relative-position"
    @click="$emit('btnClicked', book)"
  >
    <div class="main-contents col-10">
      <div class="q-ma-md main-text">
        <div class="">
          <p class="primaryText ellipsis">{{ primaryText }}</p>
        </div>
        <p class="secondaryText ellipsis">{{ secondaryText }}</p>
      </div>
      <div class="col">
        <q-btn
          color="black"
          filled
          round
          icon="keyboard_arrow_right"
          :ripple="{ early: true }"
          class="float-right q-mr-md"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    primaryText: {
      type: String,
      required: true,
    },
    secondaryText: {
      type: String,
      required: true,
    },
  },
  name: "QuickLink",

  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.container {
  height: 60px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
    0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);

  cursor: pointer;
  position: relative;
}

.main-contents {
  display: flex;
  align-items: center;
  height: 60px;
}

.main-text {
  //margin-left: 30px;
}

.primaryText {
  font-weight: 700;
  font-size: 20px;
  padding: 0;
  margin: 0;
}

.secondaryText {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11),
    0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11),
    0 16px 16px rgba(0, 0, 0, 0.11), 0 32px 32px rgba(0, 0, 0, 0.11);

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

  .primaryText {
    font-size: 16px;
  }

  .secondaryText {
    font-size: 14px;
  }
}
</style>
