<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
/*font imported: Montserrat*/
* {
  font-family: 'Montserrat', sans-serif;
}

::selection {
  background-color: #fff2a8;
  color: #151211;
}
</style>
