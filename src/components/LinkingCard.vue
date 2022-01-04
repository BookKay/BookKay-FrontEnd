<template>
  <div class="container">
    <div class="row">
      <div class="col-7 left-container">
        <div>
          <h2 class="mainText" v-if="mainText != ''">{{ mainText }}</h2>
          <p class="text" v-if="text != ''">{{ text }}</p>
          <slot></slot>
        </div>
      </div>

      <div class="col right-container">
        <div class="right-container-inner">
          <img class="img row self-center" :src="img" />
          <q-btn
            :label="label"
            outline
            rounded
            class="q-mr-md q-mb-md button row"
            :ripple="{ early: true }"
            @click="$emit('btnClicked', book)"
            v-if="label != ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinkingCard",
  props: {
    mainText: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgba(240, 250, 249);
  position: relative;
  //border: 2px solid grey;
  border-radius: 20px;
  box-shadow: 20px -9px 18px 0px rgba(24, 134, 133, 0.3);
}

.left-container {
  padding-left: 20px;
  display: flex;
  align-items: center;
}

.mainText {
  font-weight: 700;
  font-size: 28px;
  line-height: 30px;
  padding: 0;
  margin: 0;
}

.text {
  font-size: 18px;
  font-weight: 300;
  padding: 0;
  margin: 0;
  margin-top: 20px;
}

/*.right-container-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}*/

.img {
  background-size: contain;
  background-repeat: no-repeat;
  height: 18vw;
  width: 18vw;
  margin-left: auto;
  margin-right: auto;
  padding: 2px;
}

.button {
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 480px) {
  .mainText {
    font-size: 16px;
  }

  .img {
    height: 40vw;
    width: 40vw;
  }

  .text {
    font-size: 14px;
  }
}
</style>
