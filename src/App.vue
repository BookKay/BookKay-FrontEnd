<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
*::selection {
  background-color: #fff2a8;
  color: #151211;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
  opacity: 0.75;
}

/* Track */
::-webkit-scrollbar-track {
}

/* Handle */
::-webkit-scrollbar-thumb {
  right: 4px;
  border-radius: 5px;
  background: $orange-4;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $orange-3;
}

#q-app {
  background-color: #ebe6df;
}
</style>
