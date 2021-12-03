<template>
  <div v-if="Object.keys(bestOfTheDay).length > 0">
    <h2 class="sub-heading">Best of the <b>day!</b></h2>
    <div class="row">
      <stand-out-card
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
    <linking-box
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
import LinkingBox from "src/components/helpers/LinkingBox.vue";
import StandOutCard from "src/components/book/StandOutCard.vue";
export default {
  name: "BookShopList",
  components: { SimpleBookList, LinkingBox, StandOutCard },
  data() {
    return {
      // books: [
      //   {
      //     title: "Best Book LOL",
      //     author_name: "Kevin",
      //     description:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
      //     id: "1111",
      //     front_cover:
      //       "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
      //   },
      //   {
      //     title: "Holmes of the Baskervilles",
      //     author_name: "Sherlock Holmes",
      //     front_cover:
      //       "https://res.cloudinary.com/bookkay/image/upload/v1625764942/BookKay/Front%20Cover/front_cover_bd9f4da8-e00c-11eb-bf5b-ba6b82820b1a.png",
      //     description:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
      //     id: "1112",
      //   },
      //   {
      //     title: "Romeo and Juliet",
      //     author_name: "Shakespeare",
      //     front_cover:
      //       "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
      //     id: "1113",
      //   },
      //   {
      //     title: "A book",
      //     author_name: "Kevin",
      //     front_cover:
      //       "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
      //     id: "1114",
      //   },
      //   {
      //     title: "A book",
      //     author_name: "Kevin",
      //     front_cover:
      //       "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
      //     id: "1115",
      //   },
      // ],
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
