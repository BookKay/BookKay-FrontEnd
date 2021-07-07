<template>
  <div class="page">
    <q-img transition="fade" :src="$props.url" spinner-color="white" />
  </div>
</template>

<script>
export default {
  name: "Cover",
  props: {
    url: {
      type: String,
      required: true
    }
  }
};
</script>
