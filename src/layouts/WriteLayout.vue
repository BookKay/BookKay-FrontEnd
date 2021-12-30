<template>
  <q-layout view="lhh LpR lFf">
    <q-ajax-bar ref="bar" position="top" color="primary" size="5px" />

    <q-header class="bg-white text-black">
      <q-btn
        flat
        round
        icon="menu"
        class="q-ml-md q-mt-sm"
        @click="left = !left"
        :ripple="{ early: true }"
      />
    </q-header>

    <q-drawer
      v-model="left"
      show-if-above
      side="left"
      bordered
      :width="$q.screen.lt.md ? 225 : 300"
      :overlay="$q.screen.lt.sm"
      :behavior="$q.screen.lt.sm ? 'mobile' : 'desktop'"
    >
      <the-manuscript-side-bar :isReady="loaded" />
    </q-drawer>

    <q-page-container style="overflow-x: hidden">
      <router-view />
    </q-page-container>

    <q-footer>
      <app-bottom-nav />
    </q-footer>
  </q-layout>
</template>

<script>
import AppBottomNav from "src/components/AppBottomNav.vue";
import TheManuscriptSideBar from "src/components/TheManuscriptSideBar.vue";

import { editorNavigations } from "src/data/EditorNavigations.js";

export default {
  components: { AppBottomNav, TheManuscriptSideBar },
  async mounted() {
    //Fetching current manuscript
    if (this.$route.params.manuscript_id) {
      await this.initManuscript(this.$route.params.manuscript_id);
      this.loaded = true;
    } else if (this.$route.query.manuscript_id) {
      await this.initManuscript(this.$route.query.manuscript_id);
      this.loaded = true;
    } else if ("front_matter_id" in this.$route.query) {
      let response;
      let front_matter_id = this.$route.query.front_matter_id;

      response = await this.$api.get(
        `front-matters/${front_matter_id}/manuscript_id`
      );

      await this.initManuscript(response.data);
      this.loaded = true;
    } else if ("chapter_id" in this.$route.query) {
      let response;
      let chapter_id = this.$route.query.chapter_id;

      response = await this.$api.get(`chapters/${chapter_id}/manuscript_id`);

      await this.initManuscript(response.data);
      this.loaded = true;
    } else if ("back_matter_id" in this.$route.query) {
      let response;
      let back_matter_id = this.$route.query.back_matter_id;

      response = await this.$api.get(
        `back-matters/${back_matter_id}/manuscript_id`
      );

      await this.initManuscript(response.data);
      this.loaded = true;
    }
  },

  data() {
    return {
      left: false,
      tab: "write",
      navigations: editorNavigations,
      navigationsA: [
        {
          label: "Configs",
          name: "write-config",
        },

        {
          label: "Book",
          name: "write-overview",
          children: [],
        },
      ],
      loaded: false,

      selected: "",
      currentSelected: "",
    };
  },

  methods: {
    async initManuscript(manuscript_id) {
      let response;

      response = await this.$api.get("manuscripts/" + manuscript_id);

      let manuscript = response.data;

      //Updating the last edited time of manuscript
      await this.$api.post(`manuscripts/${manuscript_id}/edited`);

      response = await this.$api.get(
        "default-book-prototypes/" + response.data.prototype_id,
        {
          params: { expand: "~all" },
        }
      );

      let prototype = response.data;
      for (const key in prototype) {
        if (key in manuscript) {
          manuscript[`prototype_${key}`] = prototype[key];
        } else {
          manuscript[key] = prototype[key];
        }
      }

      this.$store.commit("write/setManuscript", manuscript);

      try {
        this.$q.sessionStorage.set("currentManuscript", manuscript);
      } catch (error) {
        console.log("err", error);
      }
    },

    compareIndex(a, b) {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    },
  },
};
</script>
