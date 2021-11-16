<template>
  <swiper
    :modules="modules"
    :slides-per-view="1"
    :effect="'fade'"
    :autoplay="{
      delay: 60000,
      disableOnInteraction: false,
    }"
  >
    <swiper-slide v-for="(image, index) in shuffledImages" :key="index">
      <div style="text-align: center">
        <img class="theme-img" style="margin: auto" :src="image" />
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { EffectFade, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

export default {
  components: { Swiper, SwiperSlide },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  name: "ThemeImage",
  mounted() {
    this.shuffledImages = this.shuffleArray(this.$props.images);
  },
  data() {
    return {
      modules: [EffectFade, Autoplay],
      shuffledImages: [],
    };
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }

      return array;
    },
  },
};
</script>
<style lang="scss" scoped>
.theme-img {
  height: 17vw;
  width: 17vw;
  margin-left: auto;
  margin-right: auto;
  border-radius: 100%;
  background-color: white;
  border: 5px solid black;
}

@media (max-width: 800px) {
  .theme-img {
    height: 30vw;
    width: 30vw;
  }
}

@media (max-width: 480px) {
  .theme-img {
    height: 40vw;
    width: 40vw;
  }
}
</style>
