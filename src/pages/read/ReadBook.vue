<template>
  <q-ajax-bar ref="bar" position="top" color="primary" size="5px" />

  <splash-screen />

  <video
    autoplay
    muted
    playsinline
    loop
    id="backgroundVideo"
    :src="videoURL"
  ></video>

  <div class="book-background">
    <q-dialog v-model="settingsDialog">
      <reader-settings
        :purchaseAble="purchaseAble"
        @toggleBook="toggleBook"
        @searchDictionary="searchDictionary"
        @themeChanged="reloadsBook"
        @purchase="purchase"
      />
    </q-dialog>

    <dictionary ref="dictionary" />

    <transition
      appear
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <div class="header top-bar" v-if="headerShow">
        <div class="top-bar__left">
          <q-btn
            dense
            flat
            round
            icon="menu"
            class="q-mx-sm"
            :color="btnColor"
            :ripple="{ early: true }"
            @click="toggleDrawer"
          />
          <q-btn
            :color="btnColor"
            icon="self_improvement"
            :label="$q.screen.lt.sm ? '' : 'Zen Mode'"
            outline
            :round="$q.screen.lt.sm"
            :ripple="{ early: true }"
            @click="toggleZen"
          />
        </div>
        <div class="top-bar__center" v-if="!$q.screen.lt.sm">
          <q-btn
            flat
            :color="btnColor"
            @click="centerBtnClicked"
            :ripple="{ early: true }"
          >
            <q-avatar class="q-ma-xs gt-sm" size="lg">
              <img src="logo/BookKay.png" />
            </q-avatar>
            <h6 class="q-ma-xs text-capitalize">BookKay</h6>
          </q-btn>
        </div>
        <div class="top-bar__right">
          <q-btn
            label="Purchase"
            v-if="$q.screen.gt.sm && purchaseAble"
            outline
            :color="btnColor"
            icon="shopping_cart"
            class="q-ma-md"
            @click="purchase"
            :ripple="{ early: true }"
          />
          <q-btn
            label="Register"
            v-else-if="$q.screen.gt.sm && !$store.getters['user/isLoggedIn']"
            outline
            :color="btnColor"
            icon="login"
            class="q-ma-md"
            @click="$router.push({ name: 'home-sign-up' })"
            :ripple="{
              early: true,
            }"
          />
          <q-btn
            :round="$q.screen.lt.sm"
            :label="$q.screen.lt.sm ? '' : 'Settings'"
            outline
            :color="btnColor"
            icon="settings"
            class="q-ma-md"
            @click="settingsDialog = true"
            :ripple="{ early: true }"
          />
          <q-btn
            round
            outline
            :color="btnColor"
            icon="expand_less"
            @click="headerShow = false"
            class="q-ma-md"
            :ripple="{ early: true }"
          />
        </div>
      </div>
    </transition>

    <div class="transparent-area" @click="headerShow = true"></div>
    <div @click="onClick">
      <book
        @navAdded="addNav"
        @swiped="handleSwipe"
        ref="book"
        class="book"
        :class="bookcss"
      />
    </div>
    <drawer :direction="'left'" :exist="true" ref="drawer">
      <div class="relative side-bar" :class="sideBarClasses">
        <div class="side-bar-contents">
          <side-bar-contents :contents="navigations" @clicked="navClicked" />
        </div>

        <q-btn
          :color="btnColor"
          outline
          icon="arrow_back"
          label="Back"
          @click="(headerShow = false), $router.go(-1)"
          class="absolute-bottom"
          style="max-width: 110px"
        />
      </div>
    </drawer>
  </div>
</template>

<script>
import SplashScreen from "src/components/TheSplashScreen.vue";
import Book from "src/components/reader/Book";
import Drawer from "src/components/reader/Drawer";
import SideBarContents from "src/components/SideBarContents.vue";
import ReaderSettings from "src/components/reader/ReaderSettings.vue";
import Dictionary from "src/components/reader/Dictionary.vue";

export default {
  components: {
    Book,
    Drawer,
    SideBarContents,
    ReaderSettings,
    Dictionary,
    SplashScreen,
  },
  name: "ReadBook",

  data() {
    return {
      headerShow: true,
      info: true,

      text: "",
      //videoURL: "video/background.mp4",
      navigations: [
        {
          name: "Front Matters",
          data: [],
        },
        {
          name: "Chapters",
          data: [],
        },
        {
          name: "Back Matters",
          data: [],
        },
      ],
      sideBarClasses: {
        "side-bar--dark": false,
      },
      purchaseAble: false,

      overflow: "hidden",

      settingsDialog: false,
      bookcss: "",
      darkMode: this.$q.dark.isActive,
    };
  },

  watch: {
    "$q.dark.isActive": function (val) {
      if (val) {
        this.sideBarClasses["side-bar--dark"] = true;
      } else {
        this.sideBarClasses["side-bar--dark"] = false;
      }
    },
  },

  computed: {
    btnColor() {
      let color = "";
      if (this.$q.dark.isActive) {
        color = "white";
      } else {
        color = "black";
      }
      return color;
    },

    videoURL() {
      let url = "";

      url = this.$q.dark.isActive
        ? "https://storage.googleapis.com/bookkay-dev.appspot.com/reader_videos/background--dark.mp4"
        : "https://storage.googleapis.com/bookkay-dev.appspot.com/reader_videos/background.mp4";
      return url;
    },
  },

  mounted() {
    this.info = !this.$q.localStorage.getItem("readerInfo");

    //Add hotkeys shortcuts
    let self = this;
    document.body.addEventListener(
      "keydown",
      function (ev) {
        //ev.preventDefault();

        // Check for ctrl + F11 for toggling zen mode
        if (ev.ctrlKey && ev.key == "F11") {
          self.toggleZen();
        }

        // Check for ctrl + B for toggling side bar
        if (ev.ctrlKey && ev.key == "b") {
          self.toggleDrawer();
        }

        // Check for ctrl + C for toggling side bar
        if (ev.ctrlKey && ev.key == "c") {
          self.toggleBook();
        }

        // Check for ctrl + / for searching on dictionary
        if (ev.ctrlKey && ev.key == "/") {
          self.searchDictionary();
        }

        // Check for ctrl + I for toggling side bar
        if (ev.ctrlKey && ev.key == "i") {
          self.settingsDialog = !self.settingsDialog;
        }
      },
      false
    );

    if (this.$q.localStorage.has("darkMode")) {
      this.$q.dark.set(this.$q.localStorage.getItem("darkMode"));
    }

    //Checking if book is owned
    this.checkPurchaseAble();
  },

  methods: {
    toggleZen() {
      this.$q.fullscreen
        .toggle()
        .then(() => {})
        .catch((err) => {
          alert(err);
        });
      this.headerShow = false;
    },

    toggleDrawer() {
      if (this.$refs.drawer.active) {
        this.$refs.drawer.close();
      } else {
        this.$refs.drawer.open();
      }
    },

    centerBtnClicked() {
      if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "base" });
      }
    },

    searchDictionary() {
      this.$refs.dictionary.openSearchDialog();
    },

    checkPurchaseAble() {
      //Checking if the user is logged in
      if (this.$store.getters["user/isLoggedIn"]) {
        let purchasedBooks =
          this.$store.getters["user/userProperty"]("books_purchased");
        let authoredBooks =
          this.$store.getters["user/userProperty"]("books_authored");

        //Checking if book id exists and initialising it
        let book_id;
        if ("book_id" in this.$route.query) {
          book_id = this.$route.query.book_id;
        } else {
          this.purchaseAble = false;
          return "";
        }

        //Checking if book is purchased or authored
        let isPurchased = purchasedBooks.some((el) => el.id === book_id);
        let isAuthored = authoredBooks.some((el) => el.id === book_id);

        if (isPurchased) {
          this.purchaseAble = false;
        } else {
          this.purchaseAble = !isAuthored;
        }
      } else {
        this.purchaseAble = false;
      }
    },

    async purchase() {
      try {
        //Purchasing the book
        await this.$api.post(`books/${this.$route.query.book_id}/purchase`);

        //Fetching back the updated user
        let response = await this.$api.get(
          "users/" + this.$store.getters["user/userProperty"]("id"),
          {
            params: { expand: "~all" },
          }
        );

        const user = response.data;

        this.$store.commit("user/setUser", user);
        this.$q.localStorage.set("user", user);

        this.$q.notify({
          color: "positive",
          position: "top",
          message: `You have successfully bought the book. Hope you enjoy it.`,
          icon: "error",
        });
      } catch (e) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Error when purchasing book",
          icon: "error",
        });
      }
      this.checkPurchaseAble();
    },

    reloadsBook() {
      this.$refs.book.loadPageFlip();
    },

    onClick() {
      this.bookcss = "";
    },

    toggleBook() {
      if (this.bookcss == "") {
        this.bookcss = "book-leave";
        this.headerShow = false;
        this.settingsDialog = false;
        this.$q.fullscreen.request();
      } else {
        this.bookcss = "";
      }
    },

    addNav(nav) {
      // if (nav["type"] == "book") {
      // } else {
      //   this.navigations[0]["children"].push(nav);
      // }

      switch (nav["type"]) {
        case "book":
          this.navigations.unshift(nav);
          break;
        case "front_matter":
          let frontMatters = this.navigations.find((obj) => {
            return obj.name === "Front Matters";
          });
          frontMatters.data.push(nav);

          break;
        case "chapter":
          let chapters = this.navigations.find((obj) => {
            return obj.name === "Chapters";
          });
          chapters.data.push(nav);

          break;
        case "back_matter":
          let backMatters = this.navigations.find((obj) => {
            return obj.name === "Back Matters";
          });
          backMatters.data.push(nav);

          break;
        default:
        // code block
      }
    },

    navClicked(nav) {
      let orientation = this.$refs.book.$refs.flipbook.getOrientation();

      if (orientation == "landscape") {
        this.$refs.book.$refs.flipbook.flip(nav.page);
      } else {
        this.$refs.book.$refs.flipbook.turnToPage(nav.page);
      }
    },

    handleSelected() {
      if (this.selected == null) {
        //Reselect the node if no nodes are selected
        this.selected = this.currentSelected;
      } else {
        this.currentSelected = this.selected;
        this.headerShow = false;
        this.$refs.book.$refs.flipbook.flip(this.currentSelected);
      }
    },

    handleSwipe(direction) {
      if (direction == "top") {
        headerShow = false;
      } else if (direction == "down") {
        headerShow = true;
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.navigations = [];
    next();
  },

  beforeRouteLeave(to, from, next) {
    this.overflow = "auto";
    next();
  },

  beforeUnmount() {
    //Clearing out session storage after using it
    if (this.$q.sessionStorage.has("currentManuscript")) {
      this.$q.sessionStorage.remove("currentManuscript");
    }
    if (this.$q.sessionStorage.has("currentBook")) {
      this.$q.sessionStorage.remove("currentBook");
    }

    //Switching off the dark mode
    this.$q.dark.set(false);
  },
};
</script>

<style lang="scss" scoped>
#backgroundVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  z-index: -10;
  overflow: hidden;
}

.book-background {
  overflow: hidden;
  //background-image: url("../../../public/table/texture.jpg");
  //background-repeat: no-repeat;
  //background-size: cover;
  height: 100vh;
}

.header {
  //background-color: #fbf0d9;
  backdrop-filter: blur(50px);
  position: absolute;
  width: 100%;
  z-index: 3;
}

.side-bar-contents {
  height: 90vh;
  overflow-y: scroll;
}

.side-bar--dark {
  background-color: var(--q-dark);
  height: 100%;
}

.top-bar {
  display: flex;
  align-items: center;

  &__left {
    flex: 1;
  }

  &__center {
    flex: 1;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  &__right {
    flex: 1;

    text-align: right;
  }
}

.transparent-area {
  position: absolute;
  background-color: none;
  height: 10vh;
  width: 60vw;
  z-index: 2;
  margin-left: 20vw;
}

.book {
  transition: 2s ease-out;
}

.book-leave {
  opacity: 0;
  transform: translateY(1000px);
  transition: 2s ease-in;
}
</style>
