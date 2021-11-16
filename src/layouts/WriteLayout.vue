<template>
  <!-- <q-layout view="hHh LpR fFf"> -->
  <q-layout view="lhh LpR lFf">
    <q-ajax-bar ref="bar" position="top" color="primary" size="5px" />
    <!-- <q-header elevated class="bg-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
          color="primary"
        />

        <q-toolbar-title>
          <q-btn flat color="orange-3" :to="{ name: 'home-homepage' }">
            <q-avatar class="q-ma-xs gt-sm">
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
                src="https://c.pxhere.com/photos/c0/74/robin_bird_japanese_robin_wildlife_animal_nature_red_erithacus-693111.jpg!d"
              />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header> -->
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
      <!-- <div class="q-ma-md q-mt-xl">
        <q-tree
          ref="navTree"
          class="col-12 col-sm-6 text-body1"
          :nodes="navigations"
          node-key="name"
          v-model:selected="selected"
          @update:selected="handleSelected"
          v-if="this.$store.getters['user/isLoggedIn']"
        />
      </div> -->
      <the-write-side-bar :isReady="loaded" />
    </q-drawer>

    <q-page-container style="overflow-x: hidden">
      <router-view />
    </q-page-container>

    <q-footer>
      <bottom-nav />
    </q-footer>
  </q-layout>
</template>

<script>
import BottomNav from "src/components/helpers/BottomNav.vue";
import TheWriteSideBar from "src/components/write/TheWriteSideBar.vue";

import { editorNavigations } from "src/data/EditorNavigations.js";

export default {
  components: { BottomNav, TheWriteSideBar },
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

  // updated() {
  //   //The codes below are used to update the navigations tree each time the drawer is opened/closed
  //   if (this.$store.getters["user/isLoggedIn"]) {
  //     //Variable name of the name label
  //     let name =
  //       "read-book/manuscript_id/" +
  //       this.$store.getters["write/manuscriptProperty"]("id");
  //     //Adding navigation for the preview after fetching the manuscript object
  //     if (!this.navigations.find((x) => x.label === "Preview")) {
  //       //if no navigation with label 'Preview'
  //       this.navigations.splice(1, 0, {
  //         label: "Preview",
  //         name: name,
  //       });
  //     } else if (!this.navigations.find((x) => x.name === name)) {
  //       //if there is navigation with label 'Preview' but its name is incorrect
  //       this.navigations.splice(1, 1, {
  //         label: "Preview",
  //         name: name,
  //       });
  //     }

  //     //Adding and removing character in the navigations tree

  //     if (
  //       //if config contain_character is true and there is not that obj in navigations
  //       this.$store.getters["write/manuscriptProperty"]("configs")
  //         .contain_character &&
  //       !this.navigations.find((x) => x.label === "Character")
  //     ) {
  //       const nav = {
  //         label: "Character",
  //         name: "write-character",
  //       };
  //       this.navigations.splice(2, 0, nav);
  //     } else if (
  //       //if config contain_character is false and there is that obj in navigations
  //       !this.$store.getters["write/manuscriptProperty"]("configs")
  //         .contain_character &&
  //       this.navigations.find((x) => x.label === "Character")
  //     ) {
  //       this.navigations.splice(2, 1);
  //     }

  //     //Manipulating front matters

  //     if (
  //       this.$store.getters["write/manuscriptProperty"]("configs")
  //         .contain_front_matter
  //     ) {
  //       //The book navigation whose children will have
  //       //front matters, chapters and back matters
  //       var book = this.navigations.find((x) => x.label === "Book").children;

  //       //Removing all the front matters first to update and add them back
  //       if (book.find((x) => x.type == "Front Matter")) {
  //         book = book.filter((item) => item.type != "Front Matter");
  //       }

  //       var frontMatters =
  //         this.$store.getters["write/manuscriptProperty"]("front_matters");

  //       frontMatters.sort(this.compareIndex);

  //       for (var i = frontMatters.length - 1; i >= 0; i--) {
  //         const frontMatter = frontMatters[i];
  //         book.unshift({
  //           label: frontMatter.title,
  //           name: "write-editor/front_matter/" + frontMatter.id,
  //           type: "Front Matter",
  //           query: { front_matter: frontMatter.id },
  //         });
  //       }

  //       this.navigations.find((x) => x.label === "Book").children = book;
  //     } else {
  //       //Deleting front matters in navigations

  //       var book = this.navigations.find((x) => x.label === "Book").children;
  //       book = book.filter((item) => item.type != "Front Matter");
  //       this.navigations.find((x) => x.label === "Book").children = book;
  //     }

  //     //Manipulating chapter

  //     if (
  //       this.$store.getters["write/manuscriptProperty"]("configs")
  //         .contain_chapter
  //     ) {
  //       //The book navigation whose children will have
  //       //front matters, chapters and back matters
  //       var book = this.navigations.find((x) => x.label === "Book").children;

  //       //Removing all the chapter first to update and add them back
  //       if (book.find((x) => x.type == "Chapter")) {
  //         book = book.filter((item) => item.type != "Chapter");
  //       }

  //       var chapters =
  //         this.$store.getters["write/manuscriptProperty"]("chapters");

  //       chapters.sort(this.compareIndex);

  //       var index = book.findIndex((x) => x.type == "Back Matter");

  //       for (var i = 0; i < chapters.length; i++) {
  //         const chapter = chapters[i];

  //         if (index == -1) {
  //           book.push({
  //             label: chapter.title,
  //             name: "write-editor/chapter/" + chapter.id,
  //             type: "Chapter",
  //           });
  //         } else {
  //           book.splice(index, 0, {
  //             label: chapter.title,
  //             name: "write-editor/chapter/" + chapter.id,
  //             type: "Chapter",
  //           });
  //           index++;
  //         }
  //       }

  //       //Deleting the main body text button if it exists
  //       book = book.filter((item) => item.label != "Main Body Text");

  //       //Setting back the navigations based on updated data
  //       this.navigations.find((x) => x.label === "Book").children = book;
  //     } else {
  //       //Deleting chapters in navigations

  //       var book = this.navigations.find((x) => x.label === "Book").children;
  //       book = book.filter((item) => item.type != "Chapter");
  //       this.navigations.find((x) => x.label === "Book").children = book;

  //       if (!book.find((x) => x.label === "Main Body Text")) {
  //         var index = book.findIndex((x) => x.type == "Back Matter");
  //         //If no other chaps/front_matters/back_matters are present
  //         if (index == -1) {
  //           book.push({
  //             label: "Main Body Text",
  //             name:
  //               "write-editor/manuscript/" +
  //               this.$store.getters["write/manuscriptProperty"]("id"),
  //             type: "Manuscript",
  //           });
  //         } else {
  //           //If there are some chaps/fronts/backs
  //           book.splice(index, 0, {
  //             label: "Main Body Text",
  //             name:
  //               "write-editor/manuscript/" +
  //               this.$store.getters["write/manuscriptProperty"]("id"),
  //             type: "Manuscript",
  //           });
  //           index++;
  //         }
  //       }
  //     }

  //     //Manipulating back matters

  //     if (
  //       this.$store.getters["write/manuscriptProperty"]("configs")
  //         .contain_back_matter
  //     ) {
  //       //The book navigation whose children will have
  //       //back matters, chapters and back matters
  //       var book = this.navigations.find((x) => x.label === "Book").children;

  //       //Removing all the back matters first to update and add them back
  //       if (book.find((x) => x.type == "Back Matter")) {
  //         book = book.filter((item) => item.type != "Back Matter");
  //       }

  //       var backMatters =
  //         this.$store.getters["write/manuscriptProperty"]("back_matters");

  //       backMatters.sort(this.compareIndex);

  //       for (var i = 0; i < backMatters.length; i++) {
  //         const backMatter = backMatters[i];
  //         book.push({
  //           label: backMatter.title,
  //           name: "write-editor/back_matter/" + backMatter.id,
  //           type: "Back Matter",
  //         });
  //       }

  //       this.navigations.find((x) => x.label === "Book").children = book;
  //     } else {
  //       //Deleting back matters in navigations

  //       var book = this.navigations.find((x) => x.label === "Book").children;
  //       book = book.filter((item) => item.type != "Back Matter");
  //       this.navigations.find((x) => x.label === "Book").children = book;
  //     }
  //   }
  // },

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
  // watch: {
  //   $route(val) {
  //     switch (this.$route.name) {
  //       case "write-config":
  //         this.selected = "write-config";
  //         break;
  //       case "read-book":
  //         this.selected =
  //           "read-book/manuscript_id/" +
  //           this.$store.getters["write/manuscriptProperty"]("id");
  //         break;
  //       case "write-overview":
  //         this.selected = "write-overview";
  //         break;
  //       case "write-editor":
  //         const key = Object.keys(this.$route.query)[0];
  //         const value = this.$route.query[key];
  //         this.selected = `write-editor/${key}/${value}`;
  //         break;
  //       default:
  //       // code block
  //     }
  //   },
  // },

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
