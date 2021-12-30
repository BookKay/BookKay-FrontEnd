<template>
  <q-card class="card">
    <q-list bordered>
      <q-item
        class="q-my-sm"
        clickable
        v-ripple.early
        @click="$emit('toggleBook')"
      >
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="vrpano" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> Rest & Chill</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-my-sm" tag="label" clickable v-ripple.early>
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="dark_mode" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> Dark Mode</q-item-label>
        </q-item-section>

        <q-item-section avatar>
          <q-toggle v-model="darkMode" color="black" keep-color />
        </q-item-section>
      </q-item>

      <q-item
        class="q-my-sm"
        clickable
        v-ripple.early
        @click="hotkeysDialog = true"
      >
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="info" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> HotKeys</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        class="q-my-sm"
        clickable
        v-ripple.early
        @click="$emit('searchDictionary')"
      >
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="translate" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> Dictionary</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="purchaseAble"
        class="q-my-sm"
        clickable
        v-ripple.early
        @click="$emit('purchase')"
      >
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="shopping_cart" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> Purchase</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-else-if="!$store.getters['user/isLoggedIn']"
        class="q-my-sm"
        clickable
        v-ripple.early
        @click="$router.push({ name: 'home-sign-up' })"
      >
        <q-item-section avatar>
          <q-avatar color="black" text-color="white">
            <q-icon name="login" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label> Register</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <hot-keys-info-dialog
    :open="hotkeysDialog"
    :hotkeys="hotkeys"
    @close="hotkeysDialog = false"
  />
</template>

<script>
import HotKeysInfoDialog from "src/components/HotKeysInfoDialog.vue";
import { readerHotkeys } from "src/data/ReaderHotKeys.js";

export default {
  name: "ReaderSettings",
  components: { HotKeysInfoDialog },
  props: {
    purchaseAble: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hotkeysDialog: false,
      hotkeys: readerHotkeys,
      darkMode: this.$q.dark.isActive,
    };
  },
  watch: {
    darkMode: function (val) {
      this.$emit("themeChanged");
      if (val == true) {
        this.$q.dark.set(true);
      } else {
        this.$q.dark.set(false);
      }
      //Storing dark mode status in local storage
      this.$q.localStorage.set("darkMode", this.$q.dark.isActive);
    },
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
.card {
  min-width: 400px;
}

@media (max-width: 480px) {
  .card {
    min-width: 350px;
  }
}

@media (max-width: 330px) {
  .card {
    min-width: 300px;
  }
}
</style>
