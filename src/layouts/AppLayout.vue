<template>
  <q-layout view="hHh lpR fFf">
    <q-ajax-bar ref="bar" position="top" color="primary" size="5px" />

    <q-page-container class="q-mb-xl">
      <splash-screen />
      <router-view />
    </q-page-container>

    <q-footer>
      <the-bottom-nav />
    </q-footer>
  </q-layout>
</template>

<script>
import TheBottomNav from "src/components/TheBottomNav.vue";
import SplashScreen from "src/components/AppSplashScreen.vue";

export default {
  components: { TheBottomNav, SplashScreen },
  mounted() {
    this.$store.dispatch("user/fetchUser");
  },

  data() {
    return {
      tab: "write",
    };
  },
  methods: {
    fetchUser() {
      this.$api
        .get("users/" + this.$store.getters["user/userProperty"]("id"), {
          params: { expand: "~all" },
        })
        .then((resp) => {
          const user = resp.data;

          this.$store.commit("user/setUser", user);
          this.$q.localStorage.set("user", user);
        });
    },
  },
};
</script>
