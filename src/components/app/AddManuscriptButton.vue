<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        class="q-ma-md"
        fab
        color="primary"
        size="lg"
        icon="add"
        @click="add_manuscript = true"
      />
    </q-page-sticky>

    <q-dialog v-model="add_manuscript" ref="manuscriptDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="titleInput"
            dense
            v-model="manuscript.title"
            placeholder="Title of your book"
            :rules="[
              val => (val !== null && val !== '') || 'Title must not be blank',
              val => val.length <= 100 || 'Title must be smaller than 100'
            ]"
            autofocus
            autogrow
          />
        </q-card-section>

        <q-card-section class="row">
          <book-type-choices
            class="col-md-3"
            v-for="bookType in this.bookTypes"
            :bookType="bookType"
            :key="bookType.id"
            @typeConfirmed="confirmType"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="
              manuscript.title = '';
              bookType = '';
            "
          />
          <q-btn flat label="Confirm" @click="add" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import BookTypeChoices from "../book/BookTypeChoices.vue";

export default {
  components: { BookTypeChoices },
  name: "AddCharacterButton",
  data() {
    return {
      manuscript: {
        title: "",
        description: "",
        temp_cover:
          "https://res.cloudinary.com/bookkay/image/upload/v1624466524/BookKay/Temp%20Cover/Temp_Cover.png",
        author_id: this.$store.getters["user/userProperty"]("id"),
        text: ""
      },

      configs: {},

      add_manuscript: false,

      bookTypes: [
        {
          id: "1",
          name: "Essay",
          configs: {
            contain_character: false,
            contain_chapter: false,
            contain_front_matter: false,
            contain_back_matter: false,
            auto_add_title: true
          },
          hint: "A simple writing with no chapters and characters",
          chosen: false
        },
        {
          id: "2",
          name: "Novel(Only chapters) ",
          configs: {
            contain_character: false,
            contain_chapter: true,
            contain_front_matter: false,
            contain_back_matter: false,
            auto_add_title: true
          },
          hint: "A large long novels with several chapters.",
          chosen: false
        },
        {
          id: "3",
          name: "Novel",
          configs: {
            contain_character: true,
            contain_chapter: true,
            contain_front_matter: true,
            contain_back_matter: true,
            auto_add_title: true
          },
          hint:
            "A large long novels with several front matters, chapters and back matters. Character drafting is automatically switched on.",
          chosen: false
        }
      ]
    };
  },
  methods: {
    add() {
      this.$refs.titleInput.validate();

      if (this.configs == {}) {
        this.$q.notify({
          icon: "error",
          color: "negative",
          message: "Please select the book type"
        });
      }

      if (!this.$refs.titleInput.hasError && this.configs != {}) {
        const manuscript = this.manuscript;
        manuscript.configs = this.configs;

        this.$emit("manuscriptAdded", manuscript);

        this.manuscript.title = "";
        this.configs = {};
        for (var i = 0; i < this.bookTypes.length; i++) {
          this.bookTypes[i].chosen = false;
        }

        this.$refs.manuscriptDialog.hide();
      }
    },
    confirmType(configs) {
      for (var i = 0; i < this.bookTypes.length; i++) {
        var bookType = this.bookTypes[i];
        if (bookType.configs == configs) {
          bookType.chosen = true;
        } else {
          bookType.chosen = false;
        }
      }

      this.configs = configs;
    }
  }
};
</script>
