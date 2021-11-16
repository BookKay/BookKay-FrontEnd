<template>
  <q-page>
    <div class="book">
      <img :src="book.front_cover" alt="Front Cover" class="bg-img" />
      <div class="book-contents">
        <div class="col">
          <div class="book-text">
            <h1 class="title">{{ book.title }}</h1>
            <p class="description">{{ book.description }}</p>
          </div>
          <div class="book-img">
            <q-btn
              color="white"
              text-color="black"
              filled
              rounded
              label="Read"
              :ripple="{ early: true }"
              class="btn"
              :to="{ name: 'read-book', query: { book_id: book.id } }"
            />
          </div>
        </div>
        <div class="col">
          <img :src="book.front_cover" alt="Front Cover" class="front-cover" />
        </div>
      </div>
    </div>

    <div>
      <div class="chapters-container row">
        <quick-link
          :primaryText="`Chapter - ${index + 1}`"
          :secondaryText="chapter.title"
          @btnClicked="onChapterClicked(chapter)"
          v-for="(chapter, index) in book.chapters"
          :key="chapter.id"
          class="chapter col-6 col-md-5"
        />
      </div>
    </div>

    <div class="row info-container">
      <linking-box
        class="col-12 col-sm-6"
        mainText="General Information"
        img="svg/information_tab.svg"
      >
        <q-list
          bordered
          separator
          :dense="$q.screen.lt.md"
          class="q-mt-md"
          style="border-radius: 30px"
        >
          <q-item clickable v-ripple>
            <q-item-section>Author: {{ book.author_name }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >Price:
              {{ book.price == 0.0 ? "Free" : book.price }}</q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >Date Published: {{ getPublishDate }}</q-item-section
            >
          </q-item>
        </q-list>
      </linking-box>
      <div class="col-sm-6"></div>
    </div>

    <div class="row stats-container">
      <div class="col-sm-6"></div>
      <linking-box
        class="col-12 col-sm-6"
        mainText="Numerical Data"
        img="svg/growing.svg"
      >
        <q-list
          bordered
          separator
          :dense="$q.screen.lt.md"
          class="q-mt-md"
          style="border-radius: 30px"
        >
          <q-item clickable v-ripple>
            <q-item-section
              >No. of Reads: {{ book.read_history }}</q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >No. of Purchases: {{ book.book_purchases }}</q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >No. of Anonymous Reads:
              {{ book.anonymous_read_history }}</q-item-section
            >
          </q-item>
        </q-list>
      </linking-box>
    </div>

    <div class="row bottom-buttons">
      <q-btn
        v-if="isPurchased"
        color="negative"
        text-color="white"
        filled
        rounded
        label="Delete"
        :ripple="{ early: true }"
        class="btn"
        @click="deleteBook"
      />
      <q-btn
        v-else-if="!isAuthored"
        color="positive"
        text-color="white"
        filled
        rounded
        label="Purchase"
        :ripple="{ early: true }"
        class="btn"
        @click="purchaseBook"
      />
      <q-btn
        color="white"
        text-color="black"
        filled
        rounded
        label="Copy Link"
        :ripple="{ early: true }"
        class="btn"
        @click="copyLink"
      />
    </div>
  </q-page>
</template>

<script>
import QuickLink from "src/components/book/QuickLink.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";
import { copyToClipboard } from "quasar";

export default {
  name: "BookDetailPage",
  components: { QuickLink, LinkingBox },

  data() {
    return {
      book: {
        title: "Best Book LOL hohoo a very lonnnnnnnnnngggg title",
        author_name: "Kevin",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
        id: "1111",
        price: 0,
        front_cover:
          "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
        chapters: [
          { title: "A new life", id: "1" },
          { title: "A tragedy", id: "2" },
          { title: "Hoho", id: "3" },
          { title: "OMG", id: "4" },
          { title: "The Finale", id: "5" },
        ],
      },
      isPurchased: false,
      isAuthored: false,
      domainName: "bookkay.com",
    };
  },

  computed: {
    getPublishDate() {
      let date = new Date(this.book.publish_date);

      return date.toDateString();
    },

    getShopURL() {
      let name = this.$route.name.startsWith("app")
        ? "app-browse-book"
        : "home-browse-book";

      const resolved = this.$router.resolve({
        name: name,
        params: { book_id: this.book.id },
      });

      return resolved.href;
    },
  },

  async mounted() {
    //Fetch book and its data
    let response = await this.$api.get("books/" + this.$route.params.book_id, {
      params: { expand: "~all" },
    });

    let book = response.data;

    response = await this.$api.get(
      "default-book-prototypes/" + response.data.prototype_id,
      {
        params: {
          expand: "chapters",
          fields: "chapters.id,chapters.title,chapters.index",
        },
      }
    );

    let prototype = response.data;
    book.chapters = prototype.chapters;

    //Fetch book's read history data
    response = await this.$api.get(
      `books/${this.$route.params.book_id}/read_history`
    );

    book.read_history = response.data.read_history;

    response = await this.$api.get(
      `books/${this.$route.params.book_id}/anonymous_read_history`
    );

    book.anonymous_read_history = response.data.anonymous_read_history;

    response = await this.$api.get(
      `books/${this.$route.params.book_id}/purchases_count`
    );

    book.book_purchases = response.data.book_purchases;

    this.book = book;

    this.checkOwned();
  },

  methods: {
    onChapterClicked(chapter) {
      this.$router.push({
        name: "read-book",
        query: { book_id: this.book.id, chapter_id: chapter.id },
      });
    },

    checkOwned() {
      //Checking if the user has authored or purchased the book
      if (this.$store.getters["user/isLoggedIn"]) {
        let purchasedBooks =
          this.$store.getters["user/userProperty"]("books_purchased");
        let authoredBooks =
          this.$store.getters["user/userProperty"]("books_authored");

        this.isPurchased = purchasedBooks.some((el) => el.id === this.book.id);

        this.isAuthored = authoredBooks.some((el) => el.id === this.book.id);
      }
    },

    async deleteBook() {
      //Deleting purchase of book
      await this.$api.delete(`books/${this.$route.params.book_id}/purchase`);

      //Fetching back the user
      let response = await this.$api.get(
        "users/" + this.$store.getters["user/userProperty"]("id"),
        {
          params: { expand: "~all" },
        }
      );

      const user = response.data;

      this.$store.commit("user/setUser", user);
      this.$q.localStorage.set("user", user);

      //Redirecting to the app page
      this.$router.push({ name: "app-read" });
    },

    purchaseBook() {
      this.$router.push({
        name: "app-purchase-book",
        params: { book_id: this.book.id },
      });
    },

    async copyLink() {
      const url = this.domainName + this.getShopURL;

      try {
        await copyToClipboard(url);
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "URL copied to clipboard",
        });
      } catch {
        this.$q.notify({
          icon: "error",
          color: "negative",
          message: "There was an error when copying to clipboard",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  height: 400px;
  width: 300px;
}

.book {
  overflow: hidden;
  position: relative;
  width: 100%;
  //height: 80vh;
  border-radius: 0 0 50px 50px;
}

.bg-img {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
  opacity: 0.1;
}

.book-contents {
  display: -webkit-flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 30px;
}

.book-text {
  //margin-left: 60px;
  margin-bottom: 30px;
}

.title {
  font-weight: 700;
  font-size: 22px;
  line-height: 35px;
  padding: 0;
  margin: 0;
}

.description {
  font-size: 14px;
  font-weight: 300;
  padding: 0;
  margin: 0;
  margin-top: 20px;
  text-align: justify;
}

.front-cover {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
  background-size: contain;
  background-repeat: no-repeat;
}

.btn {
  margin-left: auto;
  margin-right: auto;
  width: 20vw;
  display: block;
}

.chapters-container {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
}

.chapter {
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
}

.info-container {
  margin-top: 80px;
  margin-left: 20px;
  margin-right: 20px;
}

.stats-container {
  margin-left: 20px;
  margin-right: 20px;
}

.bottom-buttons {
  margin-top: 50px;
}

@media (max-width: 480px) {
  .front-cover {
    height: 60vw;
    width: 40vw;
    margin: 0 5px;
    border-radius: 20px;
  }

  .book-contents {
    margin: 5px;
    margin-left: 10px;
  }

  .title {
    height: 65px;
    width: 150px;
    margin-left: 10px;
    //margin-right: 10px;
    overflow: hidden;
  }

  .description {
    height: 140px;
    margin-left: 10px;
    margin-right: 10px;
    overflow: hidden;
    font-size: 12px;
  }

  .btn {
    width: 50vw;
    margin-bottom: 10px;
  }

  .chapter {
    margin: 10px 15px;
  }

  .stats-container {
    margin-top: 40px;
  }
}
</style>
