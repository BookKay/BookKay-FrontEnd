<template>
  <div style="text-align: center">
    <img class="theme-img" style="margin: auto" :src="imageSrc" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    image: {
      type: String,
      required: true,
    },
  },
  name: "ImageCircle",
  data() {
    return {
      imageSrc: this.$props.image,
    };
  },
  watch: {
    "$props.image": {
      handler: function (image) {
        console.log(image);
      },
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
