<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
::selection {
  background-color: #fff2a8;
  color: #151211;
}
</style>
