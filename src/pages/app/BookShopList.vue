<template>
  <div v-if="Object.keys(bestOfTheDay).length > 0">
    <h2 class="sub-heading">Best of the <b>day!</b></h2>
    <div class="row">
      <book-standout-card
        :book="bestOfTheDay"
        btnLabel="Read"
        @btnClicked="onPrimaryClicked"
        class="col"
      />
      <div class="col" v-if="!$q.screen.lt.md" />
    </div>
  </div>

  <div v-for="genre in genres" :key="genre.name">
    <div v-if="books[genre.name].length > 0" class="books-list">
      <h2 class="sub-heading">{{ genre.informal_description }}</h2>
      <simple-book-list
        :books="books[genre.name]"
        primaryLabel="Read"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="onSecondaryClicked"
      />
    </div>
    <div v-else-if="loading"></div>
  </div>

  <div>
    <linking-card
      class="refresh-link"
      mainText="Haven't found any book that catches your eye?"
      text="Let's refresh then! "
      img="svg/exciting_news.svg"
      label="Let's refresh!"
      @btnClicked="refresh"
    />
  </div>
</template>
<script>
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import LinkingCard from "src/components/LinkingCard.vue";
import BookStandoutCard from "src/components/BookStandoutCard.vue";

export default {
  name: "BookShopList",
  components: { SimpleBookList, LinkingCard, BookStandoutCard },
  data() {
    return {
      bestOfTheDay: {},
      books: {},
      loading: true,
      genres: [],
    };
  },
  async mounted() {
    //Fetching genre options
    let response = await this.$api.get("genres");
    let genres = response.data.results;

    for (const genre of genres) {
      this.genres.push({
        name: genre.name,
        informal_description: genre.informal_description,
      });

      this.books[genre.name] = [];
    }

    await this.fetchBooks();
    await this.fetchBestOfTheDay();
  },
  methods: {
    async refresh() {
      let heading = document.getElementById("shop-heading");

      heading.scrollIntoView({ behavior: "smooth" });
      await this.fetchBooks();
    },

    async fetchBooks() {
      this.loading = true;

      //Initially changing all books for each genre to blank list to activate skeleton loading
      for (const genre of this.genres) {
        this.books[genre.name] = [];
      }

      //Requesting server for books of each genre
      for (const genre of this.genres) {
        //Sending request
        let response = await this.$api.get("books/genres", {
          params: {
            name: genre.name,
            fields: "id,title,author_name,front_cover",
          },
        });

        //Populating books based on fetched data
        let fetchedBooks = response.data;
        for (const book of fetchedBooks) {
          this.books[genre.name].push(book);
        }
      }

      this.loading = false;
    },

    async fetchBestOfTheDay() {
      let response = await this.$api.get("books/best_of_the_day", {
        params: { fields: "id,title,author_name,description,front_cover" },
      });

      this.bestOfTheDay = response.data[0];
    },

    onPrimaryClicked(book) {
      this.$router.push({
        name: "read-book",
        query: { book_id: book.id },
      });
    },

    onSecondaryClicked(book) {
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
h2 {
  color: #004036;
}

.sub-heading {
  margin: 5px;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 28px;
  line-height: 1.7em;
}

.books-list {
  margin-top: 50px;
}

.refresh-link {
  width: 50vw;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 480px) {
  .refresh-link {
    width: 95vw;
  }
}
</style>
