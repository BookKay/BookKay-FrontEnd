<template>
  <div class="container" v-if="show">
    <div class="intro">
      <div class="intro-text">
        <h1 class="hide">
          <span class="text">Read & Write</span>
        </h1>
        <h1 class="hide">
          <span class="text">with</span>
        </h1>
        <h1 class="hide">
          <span class="text">Zen mode.</span>
        </h1>
      </div>
    </div>
    <div class="slider"></div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

export default {
  name: "AppSplashScreen",
  setup() {
    const $q = useQuasar();

    onMounted(() => {
      //Initialising gsap for animations
      const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

      tl.to(".text", { y: "0%", duration: 1.5, stagger: 0.25 });
      tl.to(".slider", { y: "-100%", duration: 2, delay: 0.5 });
      tl.to(".intro", { y: "-100%", duration: 1 }, "-=1.5");
    });

    const show = ref(!$q.sessionStorage.getItem("splashScreenShown"));
    if (show.value) {
      $q.sessionStorage.set("splashScreenShown", true);
    }

    return { show };
  },
};
</script>

<style lang="scss" scoped>
.intro {
  background: #0d6e5f;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.slider {
  background-image: url("../../public/homepage/meditation.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
  z-index: 100;
}

.intro-text {
  color: rgb(232, 236, 236);
  font-size: 2rem;
}

.hide {
  background: #0d6e5f;
  overflow: hidden;
}

.hide span {
  transform: translateY(100%);
  display: inline-block;
}

@media (max-width: 480px) {
  .text {
    font-size: 3.5rem;
  }
}
</style>
