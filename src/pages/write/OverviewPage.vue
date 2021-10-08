<template>
  <q-page>
    <!-- <div class="col">
      <chapters-list
        type="front-matter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_front_matter
        "
      />

      <chapters-list
        type="chapter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs').contain_chapter
        "
      />
      <q-btn
        v-else
        class="q-ma-md"
        label="Edit main body text"
        icon="edit"
        color="primary"
        :to="{
          name: 'write-editor',
          query: {
            manuscript: $store.getters['write/manuscriptProperty']('id')
          }
        }"
      />

      <chapters-list
        type="back-matter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_back_matter
        "
      />

      <add-chapter-button
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_front_matter ||
            $store.getters['write/manuscriptProperty']('configs')
              .contain_chapter ||
            $store.getters['write/manuscriptProperty']('configs')
              .contain_back_matter
        "
      />
    </div> -->

    <div class="book-covers-container">
      <div class="book-covers">
        <image-uploader
          :img="this.frontCover"
          label="Front Cover"
          class="front-cover"
          @uploaded="uploadHandler"
          @clear="clearHandler"
        />
        <image-uploader
          :img="this.backCover"
          label="Back Cover"
          class="back-cover"
          @uploaded="uploadHandler"
          @clear="clearHandler"
        />
      </div>
    </div>

    <div class="list-container">
      <q-list>
        <div v-for="(field, index) in fields" :key="index">
          <q-item
            clickable
            v-ripple.early
            style="border-radius: 30px"
            @click="field.clickHandler"
          >
            <q-item-section>
              <q-item-label>{{ field.label }}</q-item-label>
              <q-item-label caption :lines="field.lines ? field.lines : '2'">{{
                field.value
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                :name="field.icon || 'keyboard_arrow_right'"
                :color="field.color || 'black'"
              />
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </div>
      </q-list>
    </div>

    <q-dialog v-model="configsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Configs</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>
            Contain Front Matter:
            <q-toggle v-model="containFrontMatter" color="green" keep-color />
          </div>
          <div>
            Contain Chapter:
            <q-toggle v-model="containChapter" color="green" keep-color />
          </div>
          <div>
            Contain Back Matter:
            <q-toggle v-model="containBackMatter" color="green" keep-color />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Ok"
            color="primary"
            :ripple="{ early: true }"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <prompt-dialog
      v-for="(dialog, index) in promptDialogs"
      :key="index"
      :open="dialog.state"
      :label="dialog.label"
      :caption="dialog.caption"
      :value="dialog.value"
      :rules="dialog.rules"
      @confirmed="dialog.confirmHandler"
    />

    <confirm-dialog
      :open="confirmDialog.state"
      :header="confirmDialog.label"
      :text="confirmDialog.text"
      btnLabel="Disable"
      btnColor="red"
      @confirmed="confirmConfigs"
    />
  </q-page>
</template>

<script>
import ImageUploader from "src/components/helpers/ImageUploader.vue";
import PromptDialog from "src/components/helpers/PromptDialog.vue";
import ConfirmDialog from "src/components/helpers/ConfirmDialog.vue";

export default {
  name: "OverviewPage",
  components: { PromptDialog, ConfirmDialog, ImageUploader },
  data() {
    return {
      frontCover: "https://placeimg.com/500/300/nature",
      backCover: "",
      title: "The Great Book",
      description: "A very very interesting book",
      authorName: "Kevin",
      price: "Free",

      containFrontMatter: true,
      containChapter: true,
      containBackMatter: true,
      confirmDialog: { state: false, label: "", text: "", data: "" },

      titleDialog: false,
      descriptionDialog: false,
      configsDialog: false,
      deleteDialog: false,
      publishDialog: false,
    };
  },

  watch: {
    containFrontMatter: function (val) {
      if (!val) {
        this.confirmDialog["state"] = true;
        this.confirmDialog["data"] = "containFrontMatter";
        this.confirmDialog["label"] = "Diable Front Matters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable front matters? This will delete all your current front matters.";
      } else {
        this.toggleConfigs("containFrontMatter", true);
      }
    },

    containChapter: function (val) {
      if (!val) {
        this.confirmDialog["state"] = true;
        this.confirmDialog["data"] = "containChapter";
        this.confirmDialog["label"] = "Diable Chapters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable chapters? This will delete all your current chapters.";
      } else {
        this.toggleConfigs("containChapter", true);
      }
    },

    containBackMatter: function (val) {
      if (!val) {
        this.confirmDialog["state"] = true;
        this.confirmDialog["data"] = "containBackMatter";
        this.confirmDialog["label"] = "Diable Back Matters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable back matters? This will delete all your current back matters.";
      } else {
        this.toggleConfigs("containBackMatter", true);
      }
    },
  },

  computed: {
    // frontCover() {
    //   return this.$store.getters["write/manuscriptProperty"]("front_cover");
    // },
    // backCover() {
    //   return this.$store.getters["write/manuscriptProperty"]("back_cover");
    // },
    // title() {
    //   return this.$store.getters["write/manuscriptProperty"]("title");
    // },
    // description() {
    //   return this.$store.getters["write/manuscriptProperty"]("description");
    // },
    // authorName() {
    //   return this.$store.getters["users/userProperty"]("author_name");
    // },

    fields() {
      return [
        {
          label: "Title",
          value: this.title,
          clickHandler: this.changeTitle,
        },
        {
          label: "Description",
          value: this.description,
          clickHandler: this.changeDescription,
        },
        {
          label: "Author Name",
          value: this.authorName,
        },
        {
          label: "Price",
          value: this.price,
          //clickHandler: this.changePrice,
        },
        {
          label: "Edit Configs",
          clickHandler: this.editConfigs,
        },
        {
          label: "Delete",
          icon: "delete",
          color: "red",
          clickHandler: this.delete,
        },
        {
          label: "Publish",
          icon: "publish",
          color: "green",
          clickHandler: this.publish,
        },
      ];
    },

    promptDialogs() {
      return [
        {
          label: "Title",
          state: this.titleDialog,
          value: this.title,
          rules: [
            (val) => (val !== null && val !== "") || "Please type your title",
            (val) => val.length <= 100 || "Title must be smaller than 100",
          ],
          confirmHandler: this.confirmTitle,
        },
        {
          label: "Description",
          state: this.descriptionDialog,
          value: this.description,
          rules: [
            (val) =>
              (val !== null && val !== "") || "Please type your description",
          ],
          confirmHandler: this.confirmDescription,
        },
        {
          label: "Delete Confirmation",
          caption: `Are you sure you want to DELETE? After deleting all related data of this manuscript will be permanently lost. If you are confirmed, type in <b>${this.title}</b>`,
          state: this.deleteDialog,
          value: "",
          rules: [
            (val) =>
              (val !== null && val !== "") ||
              `Please type in ${this.title} to confirm`,
            (val) =>
              val == this.title || `Pleaseee type in ${this.title} to confirm`,
          ],
          confirmHandler: this.confirmDelete,
        },
        {
          label: "Publish Confirmation",
          caption: `Are you sure you want to publish? After publishing you cannot edit or delete the book. If you are confirmed, type in <b>${this.title}</b>`,
          state: this.publishDialog,
          value: "",
          rules: [
            (val) =>
              (val !== null && val !== "") ||
              `Please type in ${this.title} to confirm`,
            (val) =>
              val == this.title || `Pleaseee type in ${this.title} to confirm`,
          ],
          confirmHandler: this.confirmPublish,
        },
      ];
    },
  },
  methods: {
    uploadHandler() {},

    async clearHandler() {
      try {
        await this.$store.dispatch("write/editManuscript", { front_cover: "" });
      } catch {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Edit unsuccessful",
          icon: "error",
        });
      }
    },

    changeTitle() {
      this.titleDialog = true;
    },

    changeDescription() {
      this.descriptionDialog = true;
    },

    editConfigs() {
      this.configsDialog = true;
    },

    delete() {
      this.deleteDialog = true;
    },

    publish() {
      this.publishDialog = true;
    },

    confirmConfigs(result) {
      this.confirmDialog.state = false;
      if (result) {
        this.toggleConfigs(config, true);
      } else {
        this[this.confirmDialog.data] = true;
      }
    },

    async toggleConfigs(config, result) {
      try {
        await this.$store.dispatch("write/editConfigs", this.configs);
      } catch {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Edit unsuccessful",
          icon: "error",
        });
      }
    },

    async confirmTitle(newTitle) {
      this.titleDialog = false;
      if (newTitle && newTitle != this.title) {
        let payload = { title: newTitle };
        try {
          await this.$store.dispatch("write/editManuscript", payload);
        } catch {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Edit unsuccessful",
            icon: "error",
          });
        }
      }
    },

    async confirmDescription(newDescription) {
      this.descriptionDialog = false;
      if (newDescription && newDescription != this.description) {
        let payload = { description: newDescription };
        try {
          await this.$store.dispatch("write/editManuscript", payload);
        } catch {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Edit unsuccessful",
            icon: "error",
          });
        }
      }
    },

    async confirmDelete(result) {
      this.deleteDialog = false;
      if (result) {
        try {
        } catch {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Edit unsuccessful",
            icon: "error",
          });
        }
      }
    },

    async confirmPublish(result) {
      this.publishDialog = false;
      if (result) {
        try {
        } catch {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Edit unsuccessful",
            icon: "error",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.book-covers-container {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 50px;
}

.book-covers {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.front-cover {
  margin: auto;
}

.back-cover {
  margin: auto;
}

.list-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 480px) {
  .book-covers {
    width: 98%;
  }

  .list-container {
    width: 98%;
  }
}
</style>
