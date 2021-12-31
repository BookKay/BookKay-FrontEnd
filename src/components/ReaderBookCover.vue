<template>
  <div class="page" :class="pageClasses">
    <!-- <q-img
      transition="fade"
      :src="$props.url"
      spinner-color="white"
      height="100%"
      width="50%"
      fit="fill"
    /> -->
    <img class="cover-img" :src="$props.url" :alt="$props.url" />
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { watch, reactive } from "vue";

export default {
  name: "Reader Book Cover",
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $q = useQuasar();

    const pageClasses = reactive({
      "page--dark": $q.dark.isActive,
    });

    watch(
      () => $q.dark.isActive,
      (val) => {
        if (val) {
          pageClasses["page--dark"] = true;
        } else {
          pageClasses["page--dark"] = false;
        }
      }
    );

    return { pageClasses };
  },
};
</script>
<style lang="scss" scoped>
.cover-img {
  width: 100%;
  //max-width: 500px;
  height: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.page {
  background-color: #fff;
  text-align: center;
}

.page--dark {
  background-color: #000;
}
</style>
