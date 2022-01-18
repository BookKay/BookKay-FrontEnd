<template>
  <div class="fullscreen text-center flex flex-center">
    <div>
      <img src="svg/page_not_found.svg" alt="Page Not Found" class="img" />

      <div class="text" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-lg"
        color="white"
        text-color="blue"
        rounded
        outline
        to="/"
        :ripple="{ early: true }"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Error404',
});
</script>
<style lang="scss" scoped>
.img {
  width: 40vw;
  height: 30vw;
}

.text {
  font-size: 60px;
  line-height: 80px;
}

@media (max-width: 780px) {
  .img {
    width: 50vw;
    height: 50vw;
  }
}

@media (max-width: 480px) {
  .img {
    width: 80vw;
    height: 80vw;
  }

  .text {
    font-size: 30px;
  }
}
</style>
