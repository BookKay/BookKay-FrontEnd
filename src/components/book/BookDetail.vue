<template>
  <div>
    <q-parallax class="window-width " :height="computeHeight">
      <template v-slot:media>
        <div>
          <q-img
            :src="book.front_cover"
            height="100%"
            id="book_cover"
            :contain="$q.screen.lt.md"
          />
        </div>
      </template>
      <template v-slot:content>
        <div>
          <q-btn
            :label="button.label"
            :icon="button.icon"
            color="primary"
            size="large"
            :to="{ name: 'home-purchase_book', params: { book_id: book.id } }"
          />
        </div>
      </template>
    </q-parallax>

    <div class="q-ma-lg">
      <div>
        <div class="row q-ml-md">
          <h2 class="q-mb-md">{{ book.title }}</h2>
        </div>

        <q-separator inset class="q-mb-md" />

        <div class="row q-ma-md text-h5">Author: {{ book.author }}</div>

        <div class="row q-ma-md text-h5">
          Date Published: {{ book.date_published }}
        </div>

        <div class="row q-ma-md text-h5">
          Price: {{ book.price == 0 ? "Free :)" : "$ " + book.price }}
        </div>

        <div class="row q-ma-md q-mb-xl text-h5">
          Description: {{ book.description }}
        </div>
      </div>
      <div v-if="is_purchased">
        <div class="row q-ma-md q-mb-xl text-h5">
          Date Purchased: {{ book.purchase_date }}
        </div>
      </div>
      <q-btn
        color="primary"
        class="full-width"
        :label="button.label"
        :icon="button.icon"
        size="large"
        :to="{ name: 'home-purchase_book', params: { book_id: book.id } }"
      />
    </div>

    <q-parallax class="window-width" :height="computeHeight">
      <template v-slot:media>
        <div>
          <q-img
            :src="book.back_cover"
            height="100%"
            id="book_cover"
            :contain="$q.screen.lt.md"
          />
        </div>
      </template>
    </q-parallax>
  </div>
</template>

<script>
export default {
  name: "BookDetail",
  created() {
    console.log(this.$props.logged_in);
    console.log(this.$props.is_purchased);
    if (
      this.$props.is_purchased ||
      (this.$props.book.price == 0 && !this.$props.logged_in)
    ) {
      this.button.label = "Read";
      this.button.icon = "auto_stories";
    } else {
      this.button.label = "Purchase";
      this.button.icon = "shopping_cart";
    }
  },
  computed: {
    computeHeight() {
      return this.$q.screen.lt.sm ? 480 : 2000;
    }
  },
  props: {
    book: {
      type: Object,
      required: true
    },
    is_purchased: {
      type: Boolean,
      required: true
    },
    logged_in: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      button: {
        label: "",
        icon: ""
      }
    };
  }
};
</script>
