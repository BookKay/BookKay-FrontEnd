<template>
  <q-page>
    <q-pull-to-refresh
      ref="pullRefresh"
      id="pullRefresh"
      @refresh="handleRefresh"
    >
      <div class="heading" ref="heading">
        <h1>Book Shop</h1>
      </div>

      <div class="search-bar">
        <search-bar />
      </div>

      <div v-if="books.length > 1" class="books-list">
        <h2 class="sub-heading">Feels like enjoying <b>thriller?</b></h2>
        <simple-book-list
          :books="books"
          primaryLabel="Read"
          @primaryClicked="onPrimaryClicked"
          secondaryLabel="Details"
          @secondaryClicked="onSecondaryClicked"
        />
      </div>

      <div>
        <linking-box
          class="refresh-link"
          mainText="Haven't found any book that catches your eye?"
          text="Let's refresh then! "
          img="svg/exciting_news.svg"
          label="Let's refresh!"
          @btnClicked="
            $refs.heading.scrollIntoView({ behavior: 'smooth' }),
              this.$refs.pullRefresh.trigger()
          "
        />
      </div>
    </q-pull-to-refresh>

    <!--Loading container-->
    <!--<div v-if="loading" class="window-height relative position">
      <q-spinner-ios class="absolute-center" color="teal" size="60px" />
    </div>-->
  </q-page>
</template>

<script>
import SearchBar from "src/components/helpers/SearchBar.vue";
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";

export default {
  components: { SearchBar, SimpleBookList, LinkingBox },
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
  data() {
    return {
      books: [
        {
          title: "Best Book LOL",
          author_name: "Kevin",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
          id: "1111",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
        },
        {
          title: "Holmes of the Baskervilles",
          author_name: "Sherlock Holmes",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625764942/BookKay/Front%20Cover/front_cover_bd9f4da8-e00c-11eb-bf5b-ba6b82820b1a.png",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
          id: "1112",
        },
        {
          title: "Romeo and Juliet",
          author_name: "Shakespeare",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1113",
        },
        {
          title: "A book",
          author_name: "Kevin",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1114",
        },
        {
          title: "A book",
          author_name: "Kevin",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1115",
        },
      ],
      loading: true,
    };
  },
  methods: {
    handleRefresh(done) {
      this.fetchBooks().then(() => {
        done();
      });
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

.sub-heading {
  margin: 5px;
  margin-left: 20px;
  font-size: 28px;
  line-height: 1.7em;
}

.search-bar {
  width: 80vw;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
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
  .search-bar {
    width: 90vw;
  }
}
</style>
