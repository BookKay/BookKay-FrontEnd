<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white ">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat size="md" color="primary" :to="{ name: 'home-homepage' }">
            <q-avatar class="q-ma-xs">
              <img src="icons/favicon-128x128.png" />
            </q-avatar>
            <h6 class="q-ma-xs text-capitalize">BookKay</h6>
          </q-btn>
        </q-toolbar-title>

        <q-space />

        <div>
          <q-btn
            color="orange-3"
            round
            padding="xs"
            :to="{ name: 'app-profile' }"
          >
            <q-avatar size="40px">
              <img
                alt="avatar"
                src="https://c.pxhere.com/photos/c0/74/robin_bird_japanese_robin_wildlife_animal_nature_red_erithacus-693111.jpg!d"
              />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white row">
      <q-tabs
        v-model="tab"
        align="justify"
        indicator-color="transparent"
        active-color="primary"
        class="bg-white text-black shadow-2 col"
      >
        <q-route-tab
          class=""
          name="read"
          icon="book"
          label="Read"
          :to="{ name: 'app-read' }"
        />
        <q-route-tab
          class=""
          name="write"
          icon="brush"
          label="Write"
          :to="{ name: 'app-write' }"
        />
        <q-route-tab
          class=""
          name="shop"
          icon="local_library"
          label="Shop"
          :to="{ name: 'app-store' }"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  beforeMount() {
    this.$api
      .get("users/" + this.$store.getters["user/userProperty"]("id"))
      .then(resp => {
        const user = resp.data;

        this.$store.commit("user/setUser", user);
        this.$q.localStorage.set("user", user);
      });
  },
  data() {
    return {
      tab: "write"
    };
  }
};
</script>
