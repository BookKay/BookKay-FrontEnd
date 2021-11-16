<template>
  <side-bar-contents :contents="navigations" />
</template>
<script>
import SideBarContents from "src/components/write/SideBarContents.vue";
export default {
  name: "TheWriteSideBar",
  components: { SideBarContents },
  data() {
    return {
      navigations: [],
    };
  },
  methods: {
    addNavigations(navigation) {
      this.navigations.append(navigation);
    },
  },
};
</script>
