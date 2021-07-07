<template>
  <div>
    <q-card
      class="normal-card q-mb-md"
      style="cursor: pointer;"
      v-ripple
      @click="navigate"
    >
      <q-card-section horizontal>
        <q-img class="col" :src="book.front_cover" :ratio="3 / 4" contain />

        <!-- If the book is purchased -->
        <q-card-actions v-if="is_purchased" vertical class="justify-around">
          <q-btn flat round color="primary" icon="auto_stories" />
          <q-btn
            flat
            round
            color="positive"
            icon="share"
            @click="share_link = true"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="confirm_delete = true"
          />
        </q-card-actions>

        <!-- If the book is not purchased -->
        <q-card-actions v-else vertical class="justify-around">
          <q-btn
            flat
            round
            icon="info"
            :to="{
              name: getDetailURL,
              params: { book_id: this.book.id }
            }"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="payment"
            :to="{ name: 'app-purchase-book', params: { book_id: book.id } }"
            v-if="this.$route.name.startsWith('app')"
          />
          <q-btn flat round color="primary" icon="auto_stories" v-else />
          <q-btn
            flat
            round
            color="positive"
            icon="share"
            @click="share_link = true"
          />
        </q-card-actions>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">{{ book.title }}</div>
        <div class="text-caption">By {{ book.author.author_name }}</div>
      </q-card-section>
    </q-card>

    <!-- Share Dialog -->
    <q-dialog v-model="share_link">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ book.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-field filled>
            <template v-slot:control>
              <div class="self-center full-width no-outline">
                {{ domain_name }}{{ getShopURL }}
              </div>
            </template>

            <template v-slot:append>
              <q-btn icon="content_copy" flat round @click="copy" />
            </template>
          </q-field>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="confirm_delete" persistent ref="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want delete this purchased book? No refund will be
            made.</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            icon="delete"
            label="Delete"
            color="negative"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { copyToClipboard } from "quasar";

export default {
  name: "BookCard",

  props: {
    book: {
      type: Object,
      required: true
    },
    is_purchased: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      domain_name: "bookkay.com",

      confirm_delete: false,
      share_link: false,
      purchase_btn_clicked: false
    };
  },
  computed: {
    getShopURL() {
      const resolved = this.$router.resolve({
        name: this.getDetailURL,
        params: { book_id: this.$props.book.id }
      });

      return resolved.href;
    },
    getDetailURL() {
      return this.$route.name.startsWith("app")
        ? "app-browse-book"
        : "home-browse-book";
    }
  },
  methods: {
    confirmDelete() {
      this.$emit("deleted", this.$props.book);
      this.confirm_delete = false;
    },
    copy() {
      const url = this.domain_name + this.getShopURL;
      copyToClipboard(url)
        .then(() => {
          this.$q.notify({
            icon: "done",
            color: "positive",
            message: "URL copied to clipboard"
          });
        })
        .catch(() => {
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: "There was an error when copying to clipboard"
          });
        });
    },
    navigate() {
      if (
        !this.confirm_delete &&
        !this.share_link &&
        !this.purchase_btn_clicked
      ) {
        this.$router.push({
          name: "read-book",
          query: { book_id: this.$props.book.id }
        });
      } else {
        return;
      }
    }
  }
};
</script>
