<template>
  <div class="book-background">
    <q-dialog v-model="info">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Info</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="$q.localStorage.set('readerInfo', true)"
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <p>
            - You can turn the pages of the book by scrolling, using
            front/back/left/right keys, or dragging with your cursor(desktop) or
            swipe the screen(mobile)
          </p>
          <p>
            - The top menu bar can be closed by either entering zen mode or
            clicking on the upward arrow on the right. You can then call it back
            by clicking/tapping on the top center part of the screen.
          </p>
          <p>- Please do try out our zen mode &#128521;</p>
        </q-card-section>
      </q-card>
    </q-dialog>
    <transition
      appear
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <div class="header q-pa-sm" v-if="headerShow">
        <div class="inline-block">
          <q-btn
            dense
            flat
            round
            icon="menu"
            class="q-mr-sm"
            color="primary"
            @click="toggleDrawer"
          />
          <q-btn
            class="q-ma-sm"
            color="primary"
            label="Zen Mode"
            icon="self_improvement"
            @click="toggleZen"
          />
        </div>
        <div class="inline-block absolute-center" v-if="!$q.screen.lt.sm">
          <q-btn flat color="primary" @click="$router.go(-1)">
            <q-avatar class="q-ma-xs gt-sm">
              <img src="icons/favicon-128x128.png" />
            </q-avatar>
            <h6 class="q-ma-xs text-capitalize">BookKay</h6>
          </q-btn>
        </div>
        <div class="inline-block absolute-right">
          <q-btn
            round
            color="primary"
            icon="expand_less"
            @click="headerShow = false"
            class="q-ma-md"
          />
        </div>
      </div>
    </transition>
    <div class="transparent-area" @click="headerShow = true"></div>
    <book @navAdded="addNav" @swiped="handleSwipe" ref="book" />
    <drawer :direction="'left'" :exist="true" ref="drawer">
      <div class="relative">
        <q-tree
          ref="navTree"
          class="col-12 col-sm-6 text-body1"
          :nodes="navigations"
          node-key="page"
          v-model:selected="selected"
          @update:selected="handleSelected"
        />

        <q-btn
          color="primary"
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
import Book from "src/components/reader/Book";
import Drawer from "src/components/reader/Drawer";

export default {
  components: { Book, Drawer },
  name: "ReadBook",

  data() {
    return {
      headerShow: true,
      info: true,
      text: "",
      navigations: [],
      selected: "",
      currentSelected: "",
      overflow: "hidden",
    };
  },

  mounted() {
    this.info = !this.$q.localStorage.getItem("readerInfo");
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
    addNav(nav) {
      if (nav["type"] == "book") {
        this.navigations.push(nav);
      } else {
        this.navigations[0]["children"].push(nav);
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
  },
};
</script>

<style lang="scss" scoped>
.book-background {
  overflow: hidden;
  background-image: url("../../../public/table/texture.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
}

.header {
  background-color: #fbf0d9;
  position: absolute;
  width: 100%;
  z-index: 3;
}

.transparent-area {
  position: absolute;
  background-color: none;
  height: 10vh;
  width: 60vw;
  z-index: 2;
  margin-left: 20vw;
}
</style>
