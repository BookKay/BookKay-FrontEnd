<template>
  <div>
    <div class="row q-ml-md">
      <h2 class="q-mb-md text-capitalize">{{ type.split("-").join(" ") }}</h2>
    </div>

    <q-separator inset />

    <div class="row q-ml-md">
      <q-btn
        icon="reorder"
        label="Reorder"
        color="positive"
        @click="reorder = true"
      />
    </div>

    <div class="q-mt-md row">
      <chapter
        class="col-md-3 col-sm-6 col-xs-12"
        :class="alignment"
        v-for="chapter in this.chapters"
        :chapter="chapter"
        :type="$props.type"
        :key="chapter.id"
        @titleEditted="editTitle"
        @draftEditted="editDraft"
        @deleted="deleteChapter"
      />
    </div>

    <q-dialog v-model="reorder" ref="reorderDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h4 text-capitalize">
            {{ type.split("-").join(" ") }}s
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <list-draggable
            :items="chaptersCopy"
            :dataName="'title'"
            @dropped="handleDrop"
        /></q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="chaptersCopy = chapters"
          />
          <q-btn flat label="Confirm" @click="confirmOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Chapter from "src/components/write/Chapter";
import ListDraggable from "src/components/helpers/ListDraggable";

export default {
  components: { Chapter, ListDraggable },
  mounted() {
    this.chaptersCopy = this.chapters;
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      chaptersCopy: [],
      reorder: false
    };
  },
  computed: {
    copyChapters() {
      let items = [];
      for (let i = 0; i < this.chaptersCopy.length; i++) {
        let chapter = this.chaptersCopy[i];
        items.push({
          id: chapter.id,
          data: chapter.title,
          draft: chapter.draft,
          text: chapter.text,
          index: chapter.index
        });
      }
      return items;
    },
    chapters() {
      let chap = null;
      switch (this.$props.type) {
        case "chapter":
          chap = this.$store.getters["write/manuscriptProperty"]("chapters");
          break;
        case "front-matter":
          chap = this.$store.getters["write/manuscriptProperty"](
            "front_matters"
          );
          break;
        case "back-matter":
          chap = this.$store.getters["write/manuscriptProperty"](
            "back_matters"
          );
          break;
        case "section":
          // code block
          break;
        default:
        // code block
      }
      chap.sort(this.compareIndex);

      return chap;
    },
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    }
  },
  methods: {
    compareIndex(a, b) {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    },
    editTitle(new_title, chapter) {
      chapter.title = new_title;
    },
    editDraft(new_draft, chapter) {
      chapter.draft = new_draft;
    },
    deleteChapter(chapter) {
      const index = this.chapters.indexOf(chapter);
      this.chapters.splice(index, 1);

      const payload = {
        id: chapter.id,
        type: this.$props.type
      };

      this.$store
        .dispatch("write/deleteChapter", payload /*, { root: true }*/)
        .then(data => {})
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error"
          });

          this.chapters.splice(index, 0, chapter);
        });
    },
    confirmOrder() {
      for (var i = 0; i < this.chapters.length; i++) {
        let chapter = this.chapters[i];
        let chapterCopy = this.chaptersCopy.find(obj => obj.id === chapter.id);

        if (chapter.index != chapterCopy.index) {
          const payload = {
            chapter: {
              index: chapterCopy.index,
              manuscript_id: this.$store.getters["write/manuscriptProperty"](
                "id"
              )
            },
            type: this.$props.type,
            id: chapter.id
          };
          this.$store
            .dispatch("write/editChapter", payload /*, { root: true }*/)
            .then(data => {})
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
      this.$refs.reorderDialog.hide();
    },
    handleDrop(items) {
      for (var i = 0; i < items.length; i++) {
        items[i].index = i + 1;
      }
      this.chaptersCopy = items;
    }
  }
};
</script>
