<template>
  <q-page>
    <image-circle
      :image="'https://avatars.dicebear.com/api/micah/Kevin.svg?mouth=smile'"
    />
  </q-page>
</template>

<script>
import ImageCircle from "src/components/ImageCircle.vue";

export default {
  name: "ProfileImageEditPage",
  components: { ImageCircle },
  /*
      This is the example of url to save -
      https://avatars.dicebear.com/api/micah/aung_pyae.svg?mouth=smile

      In here, 'aung_pyae' is the seed and the parameter of mouth is defined as smile

      You can find more parameters by going to https://avatars.dicebear.com/styles/micah.
      If the link above is not working, go to https://avatars.dicebear.com, click on styles on top nav
      and scroll down on the left to find 'Micah'

      Just do each step one by one and test them on your browser. Like first, try doing the seed input pop
      and make it reative to the image
   */

  /*
  You might want to reference codes from https://quasar.dev/vue-components/input to get input
  element for getting user's seed data.

  U might need dropdown/radio btn to get profile image's parameters like mouth, hair, etc.
  Here are links for them -
  https://quasar.dev/vue-components/select (Dropdown)
  https://quasar.dev/vue-components/radio (Radio btn)
  */

  data() {
    return {
      //Put your reactive data like seed value, and other options here in the format - key:value
    };
  },

  methods: {
    //Put your global functions that you want to use
  },
};
</script>

<style lang="sass" scoped></style>
