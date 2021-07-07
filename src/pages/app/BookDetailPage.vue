<template>
  <q-page class="overflow-hidden">
    <div>
      <div>
        <div class="row ">
          <h2 class="q-ma-md">{{ book.title }}</h2>
        </div>

        <q-separator inset class="q-mb-md" />

        <div class="row justify-center images">
          <div class="col  img-container">
            <img
              class="float-right"
              alt="Front Cover"
              :src="book.front_cover"
            />
          </div>
          <div class="col img-container">
            <img alt="Front Cover" :src="book.back_cover" />
          </div>
        </div>

        <div class="row q-ma-md text-h5">
          Author: {{ book.author.author_name }}
        </div>

        <div class="row q-ma-md text-h5">
          Date Published: {{ getPublishDate }}
        </div>

        <div class="row q-ma-md text-h5">
          Price: {{ book.price == 0 ? "Free :)" : "$ " + book.price }}
        </div>

        <div class="row q-ma-md text-h5">
          Description: {{ book.description }}
        </div>

        <div class="row q-ma-md q-mb-xl text-h5">
          No. of Purchases: {{ getPurchasesNum }}
        </div>
      </div>

      <q-btn
        color="primary"
        class="float-right q-mb-xl q-mr-md"
        icon="shopping_cart"
        label="Purchase"
        size="large"
        v-if="this.$route.name.startsWith('app')"
        :to="{ name: 'home-purchase_book', params: { book_id: book.id } }"
      />
      <q-btn
        color="primary"
        class="float-right q-mb-xl q-mr-md"
        icon="auto_stories"
        label="Read"
        size="large"
        v-if="!this.$route.name.startsWith('app') && book.price == 0"
        :to="{ name: 'read-book', query: { book_id: book.id } }"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "BookDetailPage",
  mounted() {
    this.$api.get("books/" + this.$route.params.book_id).then(resp => {
      const book = resp.data;

      this.book = book;
      console.log(book);
    });
  },
  computed: {
    getPublishDate() {
      let date = new Date(this.book.publish_date);

      return date.toDateString();
    },
    getPurchasesNum() {
      return this.book.purchases.length;
    }
  },
  data() {
    return {
      book: {}
    };
  }
};
</script>
<style lang="scss" scoped>
img {
  height: 400px;
  width: 300px;
}
</style>
