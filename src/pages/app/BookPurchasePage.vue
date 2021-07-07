<template>
  <q-page class="flex">
    <div class="col">
      <div class="row q-ml-md">
        <h2 class="q-mb-md">Let's Buy!!!</h2>
      </div>

      <q-separator inset class="q-mb-md" />

      <div class="row justify-center">
        <q-card class="normal-card q-mb-xl q-mt-sm" flat bordered>
          <q-card-section horizontal>
            <q-img class="col" :src="book.front_cover" :ratio="4 / 5" contain />

            <q-card-section vertical class="justify-around relative position">
              <div class="absolute-top-right">
                <q-btn
                  icon="info"
                  flat
                  rounded
                  padding="none"
                  :to="{
                    name: 'home-browse_book',
                    params: { book_id: this.book.id }
                  }"
                >
                  <q-tooltip>Click me to recheck book details</q-tooltip>
                </q-btn>
              </div>
              <div class="text-h5 q-mr-lg q-ml-xs">{{ book.title }}</div>
              <div class="text-caption q-ml-xs">
                By {{ book.author.author_name }}
              </div>
              <div class="text-body1 q-mt-xl">
                Price: {{ book.price == 0 ? "Free :)" : "$ " + book.price }}
              </div>
            </q-card-section>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="primary"
              class="full-width"
              label="Purchase"
              icon="shopping_cart"
              @click="purchase"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "BookPurchasePage",
  beforeMount() {
    this.$api.get("books/" + this.$route.params.book_id).then(resp => {
      const book = resp.data;

      this.book = book;
    });
  },
  data() {
    return {
      book: {}
    };
  },
  methods: {
    purchase() {
      const purchase = {
        book_id: this.book.id,
        user_id: this.$store.getters["user/userProperty"]("id")
      };

      this.$api
        .post("book_purchases", purchase)
        .then(resp => {
          const user = resp.data;
          this.$store.commit("user/setUser", user);
          this.$q.localStorage.set("user", user);

          this.$q.notify({
            color: "positive",
            position: "top",
            message: `You have successfully bought ${this.book.title}. Hope you enjoy it.`,
            icon: "error"
          });

          this.$router.replace({
            name: "app-read"
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
};
</script>

<style lang="scss" scoped>
.normal-card {
  width: 500px;
  max-width: 100vw;
}
</style>
