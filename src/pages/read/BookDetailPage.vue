<template>
  <q-page class="overflow-hidden">
    <book-detail :book="book" :is_purchased="true" :logged_in="true" />
  </q-page>
</template>

<script>
import BookDetail from "src/components/book/BookDetail";

export default {
  components: { BookDetail },
  name: "BookDetailPage",
  data() {
    return {
      book: {
        id: "213",
        title: "Harry Potter",
        author: "Kevin",
        front_cover: "cover/cover-1.jpg",
        back_cover: "cover/cover-2.jpg",
        date_published: "16 May 2020",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 0.0
      }
    };
  }
};
</script>
