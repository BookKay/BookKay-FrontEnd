<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[30, 18]">
      <q-fab icon="add" size="md" direction="up" color="primary">
        <q-fab-action
          @click="(type = 'Back Matter'), (add_chapter = true)"
          v-if="
            $store.getters['write/manuscriptProperty']('configs')
              .contain_back_matter
          "
          color="primary"
          label="BackMatter"
        />
        <q-fab-action
          @click="(type = 'Chapter'), (add_chapter = true)"
          v-if="
            $store.getters['write/manuscriptProperty']('configs')
              .contain_chapter
          "
          color="primary"
          label="Chapter"
        />
        <q-fab-action
          @click="(type = 'Front Matter'), (add_chapter = true)"
          v-if="
            $store.getters['write/manuscriptProperty']('configs')
              .contain_front_matter
          "
          color="primary"
          label="FrontMatter"
        />
      </q-fab>
    </q-page-sticky>

    <q-dialog v-model="add_chapter" ref="chapterDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="titleInput"
            dense
            v-model="chapter.title"
            :placeholder="titlePlaceholder"
            :rules="[
              val => (val !== null && val !== '') || 'Please type the title',
              val => val.length <= 100 || 'Title must be smaller than 100'
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent.prevent="$refs.draftInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Draft</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="draftInput"
            dense
            v-model="chapter.draft"
            :placeholder="draftPlaceholder"
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="
              chapter.title = '';
              chapter.draft = '';

              type = '';
            "
          />
          <q-btn flat label="Confirm" @click="add" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "AddChapterButton",
  data() {
    return {
      chapter: {
        title: "",
        draft: "",
        index: 0,
        text: "",
        manuscript_id: this.$store.getters["write/manuscriptProperty"]("id")
      },

      type: "",

      add_chapter: false
    };
  },
  computed: {
    titlePlaceholder() {
      return "Title of this " + this.type.toLowerCase() + "?";
    },
    draftPlaceholder() {
      return "What shall I include in this " + this.type.toLowerCase() + "?";
    }
  },
  methods: {
    add() {
      this.$refs.titleInput.validate();
      this.$refs.draftInput.validate();

      if (!this.$refs.titleInput.hasError && !this.$refs.draftInput.hasError) {
        this.chapter.index = this.$store.getters["write/manuscriptProperty"](
          this.type.toLowerCase().replace(" ", "_") + "s"
        ).length;

        const payload = {
          chapter: this.chapter,
          type: this.type
        };

        this.$store
          .dispatch("write/addChapter", payload /*, { root: true }*/)
          .then(data => {})
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });

        /*if (this.type == "Front Matter") {
          this.$emit("added", chapter, "front_matter");
        } else if (this.type == "Chapter") {
          this.$emit("added", chapter, "chapter");
        } else if (this.type == "Back Matter") {
          this.$emit("added", chapter, "back_matter");
        }*/

        this.chapter.title = "";
        this.chapter.draft = "";

        this.type = "";

        this.$refs.chapterDialog.hide();
      }
    }
  }
};
</script>
