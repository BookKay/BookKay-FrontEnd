<template>
  <div>
    <q-card class="normal-card q-mb-md">
      <q-card-section>
        <div class="items-center no-wrap">
          <div
            class="text-h6 ellipsis relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_title = true"
          >
            Title:
            <span class="text-body1 q-pa-sm text">{{ chapter.title }}</span>
          </div>
          <div
            class="text-h6 relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_draft = true"
          >
            Draft:
            <div class="text-body1 text">
              {{ chapter.draft }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-end">
        <div class="row">
          <q-btn
            icon="delete"
            color="negative"
            round
            flat
            @click="confirm_delete = true"
          />
        </div>
        <div class="row">
          <q-btn label="Edit" color="primary" class="q-ml-md" @click="edit" />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Dialogs -->

    <!-- Title Dialog -->
    <q-dialog v-model="edit_title" ref="titleDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="titleInput"
            dense
            v-model="new_title"
            :rules="[
              val => (val !== null && val !== '') || 'Please type the title',
              val => val.length <= 100 || 'Title must be smaller than 100'
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="confirmTitle"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_title = $props.chapter.title"
          />
          <q-btn flat label="Confirm" @click="confirmTitle" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Draft Dialog -->
    <q-dialog v-model="edit_draft" ref="draftDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Draft</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="draftInput"
            dense
            v-model="new_draft"
            autofocus
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_draft = $props.chapter.draft"
          />
          <q-btn flat label="Confirm" @click="confirmDraft" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Delete Dialog -->
    <q-dialog v-model="confirm_delete" persistent ref="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want delete? All related data of the chapter
            (including child sections if present) will be lost</span
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
export default {
  name: "Chapter",
  props: {
    chapter: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      new_title: this.$props.chapter.title,
      new_draft: this.$props.chapter.draft,

      edit_title: false,
      edit_draft: false,
      edit_all: false,
      confirm_delete: false
    };
  },
  methods: {
    confirmTitle() {
      this.$refs.titleInput.validate();

      if (!this.$refs.titleInput.hasError) {
        const originalTitle = this.$props.chapter.title;
        this.$emit("titleEditted", this.new_title, this.$props.chapter);

        const payload = {
          chapter: {
            title: this.new_title
          },
          id: this.$props.chapter.id,
          type: this.$props.type
        };

        this.$store
          .dispatch("write/editChapter", payload /*, { root: true }*/)
          .then(data => {})
          .catch(error => {
            this.$emit("titleEditted", originalTitle, this.$props.chapter);
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
        this.$refs.titleDialog.hide();
      }
    },
    confirmDraft() {
      this.$refs.draftInput.validate();

      if (!this.$refs.draftInput.hasError) {
        const originalDraft = this.$props.chapter.draft;
        this.$emit("draftEditted", this.new_draft, this.$props.chapter);

        const payload = {
          chapter: {
            draft: this.new_draft
          },
          id: this.$props.chapter.id,
          type: this.$props.type
        };

        this.$store
          .dispatch("write/editChapter", payload /*, { root: true }*/)
          .then(data => {})
          .catch(error => {
            this.$emit("titleEditted", originalDraft, this.$props.chapter);
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
        this.$refs.draftDialog.hide();
      }
    },

    confirmDelete() {
      this.$emit("deleted", this.chapter);
      this.$refs.deleteDialog.hide();
    },

    edit() {
      switch (this.$props.type) {
        case "front-matter":
          this.$router.push({
            name: "write-editor",
            query: { front_matter: this.$props.chapter.id }
          });
          break;
        case "chapter":
          this.$router.push({
            name: "write-editor",
            query: { chapter: this.$props.chapter.id }
          });
          break;
        case "back-matter":
          this.$router.push({
            name: "write-editor",
            query: { back_matter: this.$props.chapter.id }
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped namespaced>
.text {
  font-size: 1.2rem;
  hyphens: auto;
  white-space: pre-line;
  word-break: break-all;
}

.text-h6 {
  cursor: pointer;
}
</style>
