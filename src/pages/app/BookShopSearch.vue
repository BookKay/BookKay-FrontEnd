<template>
  <div class="text-center flex flex-center">
    <div>
      <img src="svg/page_not_found.svg" alt="Page Not Found" class="img" />

      <div class="text-h2 text" style="opacity: 0.4">
        Oops. No Books Found...
      </div>

      <q-btn
        class="q-mt-lg"
        style="width: 150px"
        color="black"
        text-color="blue"
        rounded
        outline
        :to="{ name: 'app-store-list' }"
        :ripple="{ early: true }"
        label="Go Back"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Error404",
});
</script>
<style lang="scss" scoped>
.img {
  width: 30vw;
  height: 25vw;
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
    height: 70vw;
  }

  .text {
    font-size: 30px;
    line-height: 2.75rem;
  }
}
</style>
