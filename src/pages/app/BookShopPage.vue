<template>
  <q-page>
    <q-pull-to-refresh ref="pullRefresh" @refresh="handleRefresh">
      <div class="col">
        <div class="row q-ml-md">
          <h2 class="q-mb-md">Book Store</h2>
        </div>

        <q-separator inset class="q-mb-md" />

        <div class="row" :class="alignment">
          <book-card
            class="col-md-3 col-xs-10"
            v-for="book in this.books"
            :book="book"
            :is_purchased="false"
            :key="book.id"
          />
        </div>
      </div>
    </q-pull-to-refresh>

    <!--Loading container-->
    <div v-if="loading" class="window-height relative position">
      <q-spinner-ios class="absolute-center" color="teal" size="60px" />
    </div>
  </q-page>
</template>

<script>
import BookCard from "src/components/book/BookCard";

export default {
  components: { BookCard },
  name: "ReadPage",
  computed: {
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    }
  },
  mounted() {
    this.fetchBooks().then(() => {
      this.loading = false;
    });
  },
  data() {
    return {
      books: [],
      loading: true
    };
  },
  methods: {
    handleRefresh(done) {
      this.fetchBooks().then(() => {
        done();
      });
    },
    fetchBooks() {
      return this.$api.get("books").then(resp => {
        console.log("resp", resp);
        const books = resp.data;
        this.books = books;
      });
    }
  }
};
</script>
