<template>
  <q-page>
    <q-pull-to-refresh
      ref="pullRefresh"
      id="pullRefresh"
      @refresh="handleRefresh"
    >
      <div class="heading" id="shop-heading">
        <h1>Book Shop</h1>
      </div>

      <div class="search-bar">
        <search-bar :text="searchText" ref="searchBar" @search="handleSearch" />
      </div>

      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
    </q-pull-to-refresh>

    <!--Loading container-->
    <!--<div v-if="loading" class="window-height relative position">
      <q-spinner-ios class="absolute-center" color="teal" size="60px" />
    </div>-->
  </q-page>
</template>

<script>
import SearchBar from "src/components/helpers/SearchBar.vue";

export default {
  components: { SearchBar },
  name: "ShopPage",
  computed: {
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
  },
  mounted() {
    console.log("mounted");
    /*this.fetchBooks().then(() => {
      this.loading = false;
    });*/
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name == "app-store-list") {
      this.searchText = "";
      this.$refs.searchBar.updateText("");
      next();
    } else {
      next();
    }
  },
  data() {
    return {
      loading: true,
      searchText: "",
    };
  },
  methods: {
    handleRefresh(done) {
      this.fetchBooks().then(() => {
        done();
      });
    },
    handleSearch(text) {
      if (text != "") {
        this.$router.push({
          name: "app-store-search",
          query: { search: text },
        });
      } else {
        this.$router.push({ name: "app-store-list" });
      }
    },
    fetchBooks() {
      return this.$api.get("books").then((resp) => {
        const books = resp.data;
        this.books = books;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
h1 {
  color: #0d6e5f;
}

h2 {
  color: #004036;
}

.heading {
  display: inline-block;
  border-radius: 50px;
  cursor: pointer;
  background-color: rgba(183, 226, 225);
  padding: 0 20px;
  margin: 5px 10px;
}

.heading h1 {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  font-weight: 700;
  line-height: 2em;
}

.search-bar {
  width: 80vw;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 480px) {
  .search-bar {
    width: 90vw;
  }
}
</style>
