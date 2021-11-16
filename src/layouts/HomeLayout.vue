<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white" v-if="$q.screen.lt.sm">
      <q-toolbar>
        <!-- <q-toolbar-title>
          <q-btn flat size="md" color="primary" :to="{ name: 'home-homepage' }">
            <q-avatar class="q-ma-xs">
              <img src="logo/Bookkay.svg" style="width: 30px" />
            </q-avatar>
            <h6 class="q-ma-xs text-capitalize" v-if="$q.screen.gt.sm">
              BookKay
            </h6>
          </q-btn>
        </q-toolbar-title> -->

        <q-space />

        <div v-if="!$store.getters['user/isLoggedIn']">
          <q-btn
            color="black"
            rounded
            flat
            icon="shop"
            class="q-mx-xs"
            :to="{ name: 'home-shop' }"
            :ripple="{ early: true }"
          />
          <q-btn
            outline
            color="black"
            label="Sign In"
            :to="{ name: 'home-sign-in' }"
            :ripple="{ early: true }"
          />
        </div>
        <div v-else>
          <q-btn
            color="black"
            outline
            icon="local_library"
            label="Go To App"
            class="q-mx-xs"
            :to="{ name: 'app-read' }"
            :ripple="{ early: true }"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
