<template>
  <div class="main-container flex flex-center">
    <transition-group
      tag="span"
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      class="transition-container"
    >
      <div v-if="loading" class="transition-container_loading">
        <div class="list-container">
          <q-list>
            <div v-for="index in placeholderArray" :key="index">
              <q-item v-ripple.early style="border-radius: 30px" dense>
                <q-item-section thumbnail>
                  <q-skeleton type="circle" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><q-skeleton type="rect" /></q-item-label>
                  <q-item-label caption lines="2"
                    ><q-skeleton type="text"
                  /></q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </div>
          </q-list>
        </div>
      </div>
      <div v-else-if="books.length > 0" class="transition-container_books">
        <div class="list-container">
          <q-list>
            <div v-for="(book, index) in books" :key="index">
              <q-item
                clickable
                v-ripple.early
                style="border-radius: 30px"
                @click="bookClicked(book)"
                dense
              >
                <q-item-section thumbnail>
                  <img :src="book.front_cover" class="front-cover-img" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ book.title }}</q-item-label>
                  <q-item-label caption lines="2">{{
                    book.author_name
                  }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" color="black" />
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </div>
          </q-list>
        </div>
      </div>
      <div v-else class="transition-container_not-found">
        <img
          src="svg/page_not_found.svg"
          alt="Page Not Found"
          class="not-found-img"
        />

        <div class="text-h2 text" style="opacity: 0.4">
          Oops. No Books Found...
        </div>

        <q-btn
          class="q-mt-lg"
          style="width: 150px"
          color="black"
          text-color="blue"
          rounded
          outline
          :to="{ name: 'app-store-list' }"
          :ripple="{ early: true }"
          label="Go Back"
          no-caps
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "BookShopSearch",
  data() {
    return {
      loading: true,
      searchText: "",
      placeholderArray: ["", "", "", "", ""],
      books: [],
    };
  },

  async mounted() {
    await this.fetchBooks(this.$route.query.search);
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchBooks(to.query.search);
    next();
  },

  methods: {
    async fetchBooks(searchText) {
      //Start loading
      this.loading = true;

      //Fetch the books based on search text
      this.searchText = searchText;
      let response = await this.$api.get("books/search", {
        params: {
          word: this.searchText,
          fields: "id,title,author_name,front_cover",
        },
      });
      this.books = response.data.results;

      //Stop the loading animation
      this.loading = false;
    },

    bookClicked(book) {
      //Setting up name for router
      let name;
      if (this.$store.getters["user/isLoggedIn"]) {
        name = "app-browse-book";
      } else {
        name = "home-browse-book";
      }

      this.$router.push({
        name: name,
        params: { book_id: book.id },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.transition-container {
  display: grid;

  &__loading {
    grid-area: 1 / 1 / 2 / 2;
    text-align: center;
  }

  &__books {
    grid-area: 1 / 1 / 2 / 2;
  }

  &__not-found {
    grid-area: 1 / 1 / 2 / 2;
    text-align: center;
  }
}

.list-container {
  width: 85vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
}

.front-cover-img {
  height: 100px;
  width: 100px;
}

.not-found-img {
  width: 30vw;
  height: 25vw;
}

@media (max-width: 780px) {
  .not-found-img {
    width: 50vw;
    height: 50vw;
  }

  .list-container {
    width: 95vw;
  }
}

@media (max-width: 480px) {
  .list-container {
    width: 98vw;
  }

  .front-cover-img {
    height: 70px;
    width: 70px;
  }

  .not-found-img {
    width: 80vw;
    height: 70vw;
  }

  .text {
    font-size: 30px;
    line-height: 2.75rem;
  }
}

.transition-container_not-found {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
