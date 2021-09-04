<template>
  <q-page class="flex">
    <div class="col">
      <div class="row q-ml-md">
        <h2 class="q-mb-md">My Library</h2>
      </div>

      <q-separator inset class="q-mb-md" />

      <div class="row" :class="alignment">
        <book-card
          class="col-md-3 col-xs-10"
          v-for="book in purchasedBooks"
          :book="book"
          :is_purchased="true"
          :key="book.id"
          @deleted="deleteBook"
        />

        <book-card
          class="col-md-3 col-xs-10"
          v-for="book in authoredBooks"
          :book="book"
          :is_purchased="true"
          :key="book.id"
          @deleted="deleteBook"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import BookCard from "src/components/book/BookCard";

export default {
  components: { BookCard },
  name: "ReadPage",
  beforeMount() {
    this.computePurchases();
  },
  computed: {
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
    authoredBooks() {
      let books = this.$store.getters["user/userProperty"]("books_authored");
      for (var i = 0; i < books.length; i++) {
        let book = books[i];
        book.author = {};
        book.author.author_name = this.$store.getters["user/userProperty"](
          "author_name"
        );
      }
      return books;
    }
  },
  data() {
    return {
      purchasedBooks: []
    };
  },

  methods: {
    computePurchases() {
      const books = this.$store.getters["user/userProperty"]("books_purchased");
      let outputBooks = [];

      for (var i = 0; i < books.length; i++) {
        let book = books[i].book;
        this.$api.get("users/" + book.author_id).then(resp => {
          const user = resp.data;

          book.author = {};
          book.author.author_name = user.author_name;
          outputBooks.push(book);
        });
      }

      this.purchasedBooks = outputBooks;
    },
    deleteBook(book) {
      if (
        book.author.author_name ==
        this.$store.getters["user/userProperty"]("author_name")
      ) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message:
            "Sorry, you cannot the delete the books that you have published.",
          icon: "error"
        });
      } else {
        const params = new URLSearchParams([
          ["book_id", book.id],
          ["user_id", this.$store.getters["user/userProperty"]("id")]
        ]);
        this.$api
          .get("book_purchases", { params })
          .then(resp => {
            const purchase = resp.data;

            this.$api.delete("book_purchases/" + purchase.id).then(resp => {
              const user = resp.data;

              this.$store.commit("user/setUser", user);
              this.$q.localStorage.set("user", user);

              this.computePurchases();
            });
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
