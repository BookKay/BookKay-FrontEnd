<template>
  <div></div>
</template>

<script>
export default {
  beforeMount() {
    if (
      !!this.$q.cookies.get("refreshToken") &&
      !!this.$q.localStorage.getItem("user")
    ) {
      this.$router.push({
        name: "app-read"
      });
    } else {
      this.$router.push({
        name: "home-homepage"
      });
    }
  }
};
</script>
