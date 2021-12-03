<template>
  <q-page>
    <div class="heading">
      <h1>My Library</h1>
    </div>
    <div v-if="purchasedBooks.length > 0">
      <h2 class="sub-heading">What would you like to read <b>today?</b></h2>
      <simple-book-list
        :books="purchasedBooks"
        primaryLabel="Read"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="linkToDetails"
      />
    </div>
    <div v-if="Object.keys(bestOfTheDay).length">
      <h2 class="sub-heading">Best of the <b>day!</b></h2>
      <div class="row">
        <stand-out-card
          :book="bestOfTheDay"
          btnLabel="Read"
          @btnClicked="onPrimaryClicked"
          class="col"
        />
        <theme-image class="col" :images="images" v-if="!$q.screen.lt.md" />
      </div>
    </div>
    <div v-if="Object.keys(lastRead).length > 0">
      <h2 class="sub-heading last-read">Continue <b>reading...</b></h2>
      <quick-book-link :book="lastRead" @btnClicked="onPrimaryClicked" />
    </div>
    <div class="row write-link">
      <linking-box
        class="col-12 col-sm-6"
        mainText="Feels like writing your own book?"
        text="Try writing in our editor."
        img="svg/notebook.svg"
        label="Let's write!"
        @btnClicked="
          $router.push({
            name: 'app-write',
          })
        "
      />
      <div class="col-sm-6"></div>
    </div>
    <div class="row shop-link">
      <div class="col-sm-6"></div>
      <linking-box
        class="col-12 col-sm-6"
        mainText="Feels like going out for book shopping?"
        text="Try browsing our store"
        img="svg/bookshelves.svg"
        label="Let's shop!"
        @btnClicked="
          $router.push({
            name: 'app-store-list',
          })
        "
      />
    </div>
    <div v-if="authoredBooks.length > 0">
      <h2 class="sub-heading">
        Feels like reading your published <b>books?</b>
      </h2>
      <simple-book-list
        :books="authoredBooks"
        primaryLabel="Read"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="linkToDetails"
      />
    </div>
  </q-page>
</template>

<script>
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import StandOutCard from "src/components/book/StandOutCard.vue";
import ThemeImage from "src/components/book/ThemeImage.vue";
import QuickBookLink from "src/components/book/QuickBookLink.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";

export default {
  components: {
    SimpleBookList,
    StandOutCard,
    ThemeImage,
    QuickBookLink,
    LinkingBox,
  },
  name: "AppPage",
  beforeMount() {
    //this.computePurchases();
    this.fetchBestOfTheDay();
    this.fetchLastRead();
  },
  computed: {
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
    authoredBooks() {
      let books;

      books = this.$store.getters["user/userProperty"]("books_authored");

      // for (var i = 0; i < books.length; i++) {
      //   let book = books[i];
      //   book.author = {};
      //   book.author.author_name =
      //     this.$store.getters["user/userProperty"]("author_name");
      // }
      return books;
    },
    purchasedBooks() {
      let books = [
        ...this.$store.getters["user/userProperty"]("books_purchased"),
      ];

      return books;
    },
  },
  data() {
    return {
      //purchasedBooks: [],
      isActive: false,
      images: [
        "svg/girl_reading.svg",
        "svg/absorbed_reading.svg",
        "svg/bibliophile.svg",
        "svg/book_lover.svg",
        "svg/mathematics_book.svg",
        "svg/reading_book.svg",
        "svg/reading_list.svg",
        "svg/reading_time.svg",
      ],
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

      bestOfTheDay: {},
      lastRead: {},
    };
  },

  methods: {
    async fetchBestOfTheDay() {
      let response = await this.$api.get("books/best_of_the_day", {
        params: { fields: "id,title,author_name,description,front_cover" },
      });

      if (response.data[0] != null) {
        this.bestOfTheDay = response.data[0];
      }
    },

    async fetchLastRead() {
      let response = await this.$api.get("books/last_read", {
        params: { fields: "id,title,author_name,front_cover" },
      });

      if (response.data != null) {
        this.lastRead = response.data;
      }
    },

    onPrimaryClicked(book) {
      this.$router.push({
        name: "read-book",
        query: { book_id: book.id },
      });
    },

    linkToDetails(book) {
      this.$router.push({
        name: "app-browse-book",
        params: { book_id: book.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

body,
input {
  font-family: "Poppins", sans-serif;
}

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

.last-read {
  margin-top: 40px;
}

.write-link {
  margin-top: 80px;
  margin-left: 20px;
  margin-right: 20px;
}

.shop-link {
  margin-left: 20px;
  margin-right: 20px;
}

@media (max-width: 480px) {
  .sub-heading {
    font-size: 20px;
    //margin: 0;
    margin-left: 20px;
  }

  .shop-link {
    margin-top: 40px;
  }
}
</style>
