<template>
  <q-page>
    <div class="book-covers-container">
      <div class="book-covers">
        <image-uploader
          :img="frontCover"
          :url="getFrontCoverURL"
          label="Front Cover"
          class="front-cover"
          @uploaded="uploadHandler"
          @clear="clearHandler"
        />
        <image-uploader
          :img="backCover"
          :url="getBackCoverURL"
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
import ImageUploader from "src/components/AppImageUploader.vue";
import PromptDialog from "src/components/helpers/PromptDialog.vue";
import ConfirmDialog from "src/components/AppConfirmDialog.vue";

export default {
  name: "OverviewPage",
  components: { PromptDialog, ConfirmDialog, ImageUploader },
  data() {
    return {
      // frontCover: "https://placeimg.com/500/300/nature",
      // backCover: "",
      // title: "The Great Book",
      // description: "A very very interesting book",
      // authorName: "Kevin",
      price: "Free",

      // containFrontMatter:
      //   this.$store.getters["write/manuscriptProperty"]("configs")
      //     .contain_front_matter,
      // containChapter:
      //   this.$store.getters["write/manuscriptProperty"]("configs")
      //     .contain_chapter,
      // containBackMatter:
      //   this.$store.getters["write/manuscriptProperty"]("configs")
      //     .contain_back_matter,
      containFrontMatter: false,
      containChapter: false,
      containBackMatter: false,
      confirmDialog: {
        state: false,
        label: "",
        text: "",
        data: "",
        externalData: "",
      },

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
        this.confirmDialog["externalData"] = "contain_front_matter";
        this.confirmDialog["label"] = "Diable Front Matters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable front matters? This will delete all your current front matters.";
      } else {
        this.toggleConfigs({ contain_front_matter: true });
      }
    },

    containChapter: function (val) {
      if (!val) {
        this.confirmDialog["state"] = true;
        this.confirmDialog["data"] = "containChapter";
        this.confirmDialog["externalData"] = "contain_chapter";
        this.confirmDialog["label"] = "Diable Chapters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable chapters? This will delete all your current chapters.";
      } else {
        this.toggleConfigs({ contain_chapter: true });
      }
    },

    containBackMatter: function (val) {
      if (!val) {
        this.confirmDialog["state"] = true;
        this.confirmDialog["data"] = "containBackMatter";
        this.confirmDialog["externalData"] = "contain_back_matter";
        this.confirmDialog["label"] = "Diable Back Matters";
        this.confirmDialog["text"] =
          "Are you sure you want to disable back matters? This will delete all your current back matters.";
      } else {
        this.toggleConfigs({ contain_back_matter: true });
      }
    },
    "$store.state.write.manuscript": {
      handler: function (manuscript) {
        if (manuscript != null) {
          this.containFrontMatter =
            this.$store.getters["write/manuscriptProperty"](
              "configs"
            ).contain_front_matter;

          this.containChapter =
            this.$store.getters["write/manuscriptProperty"](
              "configs"
            ).contain_chapter;

          this.containBackMatter =
            this.$store.getters["write/manuscriptProperty"](
              "configs"
            ).contain_back_matter;
        }
      },
      //deep: true,
      //immediate: true,
    },
  },

  computed: {
    frontCover() {
      return this.$store.getters["write/manuscriptProperty"]("front_cover");
    },
    backCover() {
      return this.$store.getters["write/manuscriptProperty"]("back_cover");
    },
    title() {
      return this.$store.getters["write/manuscriptProperty"]("title");
    },
    description() {
      return this.$store.getters["write/manuscriptProperty"]("description");
    },
    authorName() {
      return this.$store.getters["user/userProperty"]("author_name");
    },

    getFrontCoverURL() {
      let url = `${this.$api.defaults.baseURL}manuscripts/${this.$store.getters[
        "write/manuscriptProperty"
      ]("id")}/front_cover`;

      return url;
    },

    getBackCoverURL() {
      let url = `${this.$api.defaults.baseURL}manuscripts/${this.$store.getters[
        "write/manuscriptProperty"
      ]("id")}/back_cover`;

      return url;
    },

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
              val == this.title || `Please type in ${this.title} to confirm`,
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
    async uploadHandler() {
      //Fetching back newly updated manuscript and storing it.
      let response = await this.$api.get(
        "manuscripts/" + this.$store.state.write.manuscript.id,
        {
          params: { expand: "~all" },
        }
      );
      this.$store.commit("write/updateManuscript", response.data);
      this.$q.sessionStorage.set(
        "currentManuscript",
        this.$store.state.write.manuscript
      );
    },

    async clearHandler(label) {
      let key;
      if (label == "Front Cover") {
        key = "front_cover";
      } else if (label == "Back Cover") {
        key = "back_cover";
      }

      let payload = {};
      payload[key] = "";

      let imgPath = this.$store.getters["write/manuscriptProperty"](key);

      try {
        //Deleting the image
        await this.$api.delete(
          `manuscripts/${this.$store.getters["write/manuscriptProperty"](
            "id"
          )}/${key}`,
          { params: { img: imgPath } }
        );
        //Emptying the image url of manuscript
        await this.$store.dispatch("write/editManuscript", payload);
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
      let errMsg = "";

      let front_cover =
        this.$store.getters["write/manuscriptProperty"]("front_cover");

      let back_cover =
        this.$store.getters["write/manuscriptProperty"]("back_cover");

      //Checking for validation errors
      if (front_cover == "") {
        errMsg = "Please add front cover of your book";
      } else if (back_cover == "") {
        errMsg = "Please add back cover of your book";
      }

      //If there is error, the user is notified
      if (errMsg != "") {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: errMsg,
          icon: "error",
        });
      } else {
        this.publishDialog = true;
      }
    },

    async confirmConfigs(result) {
      //close the dialog
      this.confirmDialog.state = false;

      if (result) {
        let configs = {};
        configs[this.confirmDialog.externalData] = false;

        let result = await this.toggleConfigs(configs);
        if (!result) {
          //Toggle back to true if there is error
          this[this.confirmDialog.data] = true;
        }

        this.deleteComponents(this.confirmDialog.externalData);
      } else {
        //Toggle back to true if user cancel it
        this[this.confirmDialog.data] = true;
      }
    },

    async toggleConfigs(configs) {
      try {
        await this.$store.dispatch("write/editConfigs", configs);
        return true;
      } catch {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Edit unsuccessful",
          icon: "error",
        });
        return false;
      }
    },

    async deleteComponents(closedConfig) {
      let component = "";
      switch (closedConfig) {
        case "contain_front_matter":
          component = "front_matter";
          break;
        case "contain_chapter":
          component = "chapter";
          break;
        case "contain_back_matter":
          component = "back_matter";
          break;
        default:
        // code block
      }

      let payload = { type: component };
      let components =
        this.$store.getters["write/manuscriptProperty"](component);

      for (const component of components) {
        payload.id = component.id;
        await this.$store.dispatch("write/deleteComponent", payload);
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
          //Deleting manuscript
          await this.$api.delete(
            `manuscripts/${this.$store.getters["write/manuscriptProperty"](
              "id"
            )} `
          );

          //Getting the updated user
          let response = await this.$api.get(
            "users/" + this.$store.getters["user/userProperty"]("id"),
            {
              params: { expand: "~all" },
            }
          );

          let user = response.data;

          //Saving the user
          this.$store.commit("user/setUser", user);

          this.$router.replace({
            name: "app-write",
          });
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
          await this.$store.dispatch("write/publishBook");
          this.$router.push({ name: "app-read" });
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
