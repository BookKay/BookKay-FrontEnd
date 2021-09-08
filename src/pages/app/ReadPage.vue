<template>
  <q-page class=" ">
    <div class="heading">
      <h1>My Library</h1>
    </div>
    <div>
      <items-list />
    </div>
  </q-page>
</template>

<script>
import ItemsList from "src/components/helpers/ItemsList";
export default {
  components: { ItemsList },
  name: "AppPage",
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
      purchasedBooks: [],
      isActive: false
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

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

body,
input {
  font-family: "Poppins", sans-serif;
}

.heading {
  display: inline-block;
  border-radius: 50px;
  cursor: pointer;
  background-color: rgba(91, 55, 183, 0.2);
  color: rgba(91, 55, 183, 1);
  padding: 0 20px;
  margin: 5px 10px;
}

.heading h1 {
  margin: 0px;
  font-size: 40px;
  font-weight: bold;
}
</style>
