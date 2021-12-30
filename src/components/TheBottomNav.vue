<template>
  <div class="tab-container" :class="tabClasses">
    <div
      class="tab purple"
      v-bind:class="{ active: currentTab == 'read' }"
      @click="(currentTab = 'read'), $router.push({ name: 'app-read' })"
    >
      <q-icon name="book" class="icon" />
      <p>Read</p>
    </div>
    <div
      class="tab pink"
      v-bind:class="{ active: currentTab == 'write' }"
      @click="(currentTab = 'write'), $router.push({ name: 'app-write' })"
    >
      <q-icon name="brush" class="icon" />
      <p>Write</p>
    </div>
    <div
      class="tab yellow"
      v-bind:class="{ active: currentTab == 'shop' }"
      @click="(currentTab = 'shop'), $router.push({ name: 'app-store-list' })"
    >
      <q-icon name="shopping_cart" class="icon" />
      <p>Shop</p>
    </div>
    <div
      class="tab teal"
      v-bind:class="{ active: currentTab == 'profile' }"
      @click="(currentTab = 'profile'), $router.push({ name: 'app-profile' })"
    >
      <q-icon name="settings" class="icon" />
      <p>Profile</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheBottomNav",

  data() {
    return {
      currentTab: "read",
      readPages: ["app-read"],
      writePages: ["app-write"],
      storePages: ["app-store-list", "app-purchase-book", "app-browse-book"],
      profilePages: ["app-profile", "app-change-password"],

      tabClasses: {
        "tab-container--dark": this.$q.dark.isActive,
      },
    };
  },

  watch: {
    $route(to, from) {
      const routeName = to.name;
      if (this.readPages.includes(routeName)) {
        this.currentTab = "read";
      } else if (this.writePages.includes(routeName)) {
        this.currentTab = "write";
      } else if (this.storePages.includes(routeName)) {
        this.currentTab = "shop";
      } else if (this.profilePages.includes(routeName)) {
        this.currentTab = "profile";
      }
    },

    "$q.dark.isActive": function (val) {
      if (val) {
        this.tabClasses["tab-container--dark"] = true;
      } else {
        this.tabClasses["tab-container--dark"] = false;
      }
    },
  },

  mounted() {
    const routeName = this.$route.name;
    if (this.readPages.includes(routeName)) {
      this.currentTab = "read";
    } else if (this.writePages.includes(routeName)) {
      this.currentTab = "write";
    } else if (this.storePages.includes(routeName)) {
      this.currentTab = "shop";
    } else if (this.profilePages.includes(routeName)) {
      this.currentTab = "profile";
    }
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.tab-container {
  background: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  justify-content: space-between;
  padding: 5px;
  width: 100%;
}

.tab {
  background-color: #fff;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin: 0 10px;
  transition: background 0.4s linear;
  color: #000;
  width: 33%;
}

.tab.purple:hover {
  background: rgba(91, 55, 183, 0.2);
}

.tab.pink:hover {
  background: rgba(201, 55, 157, 0.2);
}

.tab.yellow:hover {
  background: rgba(230, 169, 25, 0.2);
}

.tab.teal:hover {
  background: rgba(28, 150, 162, 0.2);
}

.tab .icon {
  font-size: 1.2em;
}

.tab p {
  font-weight: bold;
  overflow: hidden;
  max-width: 0;
}

.tab.active p {
  margin-left: 10px;
  margin: 0 0 0 10px;
  max-width: 220px;
  transition: max-width 0.4s linear;
}

.tab.active.purple {
  background: rgba(91, 55, 183, 0.2);
  color: rgba(91, 55, 183, 1);
}

.tab.active.pink {
  background: rgba(201, 55, 157, 0.2);
  color: rgba(201, 55, 157, 1);
}

.tab.active.yellow {
  background: rgba(230, 169, 25, 0.2);
  color: rgba(230, 169, 25, 1);
}

.tab.active.teal {
  background: rgba(28, 150, 162, 0.2);
  color: rgba(28, 150, 162, 1);
}

//Dark Mode
.tab-container--dark {
  background-color: #000;
  color: #fff !important;

  .tab {
    background-color: #000;
    color: #fff !important;
  }
}

@media (max-width: 330px) {
  .tab {
    padding: 0 10px;
  }
}
</style>
