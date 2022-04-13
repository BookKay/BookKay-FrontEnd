<template>
  <div class="main-container">
    <div>
      <div>
        <h2>Members</h2>
      </div>

      <div>
        <!-- 
        Members here
        Use v-for loop to loop through the members from data
        Learn more here at https://v2.vuejs.org/v2/guide/list.html

        Then, use card style to represent each members. 
        If you wanna use quasar card, you can read here at https://quasar.dev/vue-components/card

        Links for inspirations
        https://cloudinary.com/team
        https://images01.nicepage.com/page/48/12/website-design-preview-481236.jpg
        https://www.youtube.com/watch?v=4q8AvrLrLAM
        https://www.youtube.com/watch?v=EOpt0HLymis
        https://www.youtube.com/watch?v=cP9KxNqHrUY
        https://youtu.be/QB1GbhNzwXc
         -->
      </div>

      <div class="back-btn-container">
        <q-btn
          color="black"
          label="Let's Go Back"
          :ripple="{ early: true }"
          @click="handleBackBtn"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return;
  },
  data() {
    return {
      //Put the data like members info here
      //Regarding info, you should add -
      //name, profile_image, contributions,

      //you can save profile images in public/members/<name>.jpg
      //So, imagePath will be 'members/<name>.jpg'

      members: [
        {
          name: '',
          imgPath: 'members/Placeholder-1.jpg',
          contributions: '',
          shortText: '',
        },
      ],
    };
  },
  methods: {
    //dun think you will need this lol
    handleBackBtn() {
      this.$router.go(-1);
    },
  },
});
</script>

<style lang="scss" scoped>
.main-container {
  //Delete this style if you wanna get rid of the global center align (horizontal)
  display: flex;
  justify-content: center;
}

.back-btn-container {
  display: flex;
  justify-content: center;
}
</style>
