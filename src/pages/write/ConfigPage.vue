<template>
  <q-page class="flex">
    <div class="col">
      <div class="row q-ml-lg">
        <h2 class="q-mb-sm">Manuscript Configs</h2>
      </div>
      <q-separator inset />
      <div class="row-12 q-ma-lg">
        <q-input
          ref="titleInput"
          v-model="title"
          label="Title:"
          label-color="primary"
          style="font-size: 1rem"
          filled
          :rules="[
            val => (val !== null && val !== '') || 'Please type the title',
            val => val.length <= 100 || 'Title must be smaller than 100'
          ]"
          @blur="editTitle(true)"
        />
      </div>
      <div class="row-12 q-mx-lg">
        <q-input
          ref="descriptionInput"
          v-model="description"
          label="Description:"
          label-color="primary"
          style="font-size: 1rem"
          filled
          :rules="[true || 'Description cannot be empty']"
          autogrow
          @blur="editDescription(true)"
        />
      </div>

      <file-uploader
        label="Front Cover"
        class="q-ma-lg"
        @upload="handleUpload"
        v-if="!$store.getters['write/manuscriptProperty']('front_cover')"
      />
      <q-btn
        outline
        color="positive"
        class="q-ma-lg"
        label="Front Cover"
        icon="check_circle"
        @click="
          clear_cover = true;
          coverToBeCleared = 'front_cover';
        "
        v-else
      />

      <file-uploader
        label="Back Cover"
        class="q-ma-lg"
        @upload="handleUpload"
        v-if="!$store.getters['write/manuscriptProperty']('back_cover')"
      />
      <q-btn
        outline
        color="positive"
        class="q-ma-lg"
        label="Back Cover"
        icon="check_circle"
        @click="
          clear_cover = true;
          coverToBeCleared = 'back_cover';
        "
        v-else
      />

      <div class="row-12 q-ma-md">
        <q-tree
          ref="optionsTree"
          class="col-12 col-sm-6"
          :nodes="options"
          node-key="body"
          tick-strategy="strict"
          :ticked.sync="ticked"
          @update:ticked="handleTicked"
        />
      </div>
      <div>
        <q-btn
          color="primary"
          label="Publish"
          class="q-ma-md"
          size="large"
          @click="confirm_publish = true"
        >
          <q-spinner-hourglass v-if="loading" color="white" size="1.2em" />
        </q-btn>
      </div>

      <!-- Dialog for clearing the covers -->
      <q-dialog v-model="clear_cover" ref="clearCoverDialog">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want delete? Image of
              {{ coverToBeCleared.replace("_", " ").toUpperCase() }} will be
              cleared</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              icon="delete"
              label="Delete"
              color="negative"
              @click="clearCover"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog for unticking the configs -->
      <q-dialog v-model="confirm_untick" persistent ref="deleteDialog">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want delete? All related and children data of
              the {{ difference_option_label }} will be lost</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" @click="cancelDelete" />
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

      <!-- Dialog for confirming the publish option -->
      <q-dialog v-model="confirm_publish" persistent ref="publishDialog">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want publish? The contents of the published book
              cannot be altered or deleted after it had been published.</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              icon="publish"
              label="Publish"
              color="positive"
              @click="confirmPublish"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import FileUploader from "src/components/helpers/FileUploader.vue";

export default {
  name: "ManuscriptPage",
  components: { FileUploader },

  data() {
    return {
      title: this.$store.getters["write/manuscriptProperty"]("title"),
      description: this.$store.getters["write/manuscriptProperty"](
        "description"
      ),
      frontCover: this.$store.getters["write/manuscriptProperty"](
        "front_cover"
      ),
      backCover: this.$store.getters["write/manuscriptProperty"]("back_cover"),

      options: [
        {
          label: "Contain Characters",
          body: "contain_character"
        },
        {
          label: "Contain Front Matter",
          body: "contain_front_matter"
        },
        {
          label: "Contain Chapters",
          body: "contain_chapter"
        },
        {
          label: "Contain Back Matter",
          body: "contain_back_matter"
        },
        {
          label: "Automatically add titles as h2 tags",
          body: "auto_add_title"
        }
      ],

      configs: this.$store.getters["write/manuscriptProperty"]("configs"),

      ticked: this.$store.getters["write/getConfigs"],
      selectedOptions: this.$store.getters["write/getConfigs"],

      loading: false,
      difference_option: "",
      difference_option_label: "",
      confirm_untick: false,
      confirm_publish: false,

      clear_cover: false,
      coverToBeCleared: ""
    };
  },

  methods: {
    editTitle(isFinal = false) {
      if (isFinal || !this.$store.getters["write/isLoading"]) {
        this.$store
          .dispatch(
            "write/editManuscript",
            { title: this.title } /*, { root: true }*/
          )
          .then(data => {})
          .catch(error => {
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
      }
    },
    editDescription(isFinal = false) {
      if (isFinal || !this.$store.getters["write/isLoading"]) {
        this.$store
          .dispatch(
            "write/editManuscript",
            { description: this.description } /*, { root: true }*/
          )
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
    },
    clearCover() {
      //function to clear the front cover or back cover
      if (!this.$store.getters["write/isLoading"]) {
        const payload = {};
        payload[this.coverToBeCleared] = "";

        this.$store
          .dispatch("write/editManuscript", payload /*, { root: true }*/)
          .then(data => {})
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });

        this.clear_cover = false;
      }
    },

    handleTicked(target) {
      //For unticking
      let untickDifference = this.selectedOptions.filter(
        x => !this.ticked.includes(x)
      );
      if (untickDifference.length != 0) {
        this.difference_option = untickDifference[0];
        this.difference_option_label = this.$refs.optionsTree.getNodeByKey(
          this.difference_option
        )["label"];
        this.confirm_untick = true;
      }

      //For ticking
      let tickDifference = this.ticked.filter(
        x => !this.selectedOptions.includes(x)
      );
      if (tickDifference.length != 0) {
        this.selectedOptions.push(config);

        const config = tickDifference[0];
        this.configs[config] = true;

        this.$store
          .dispatch("write/editConfigs", this.configs /*, { root: true }*/)
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
    },

    handleUpload(payload, callback) {
      //Uploading image to cloudinary
      //if (!this.$store.state.write.loading) {
      let formData = new FormData();

      let file = payload.files[0];
      let folder = payload.type;
      let type = folder.toLowerCase().replaceAll(" ", "_");

      //public_id to determine which folder to upload to
      let public_id = `BookKay/${folder}/${type}_${this.$store.getters[
        "write/manuscriptProperty"
      ]("id")}`;

      formData.append("file", file, public_id);

      //Firstly uploading the image to cloudinary through the back end
      //Then, sending over the url to be saved in manuscript
      this.$store
        .dispatch("write/uploadMedia", formData /*, { root: true }*/)
        .then(data => {
          let url = data.data.secure_url;

          callback(true);

          let cover = {};
          cover[type] = url;

          this.$store
            .dispatch("write/editManuscript", cover /*, { root: true }*/)
            .then(data => {})
            .catch(error => {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: error.response.data.message || "Something went wrong",
                icon: "error"
              });
            });
        })
        .catch(error => {
          callback(false);
          var msg = "";
          try {
            msg = error.response.data.message;
          } catch {
            msg = "Something went wrong. Please try refreshing the page";
          }
          this.$q.notify({
            color: "negative",
            position: "top",
            message: msg,
            icon: "error"
          });
        });
      //}
    },

    confirmDelete() {
      const index = this.selectedOptions.indexOf(this.difference_option);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.confirm_untick = false;

      const config = this.difference_option;

      this.configs[config] = false;

      this.$store
        .dispatch("write/editConfigs", this.configs /*, { root: true }*/)
        .then(data => {
          let type = "";

          //Convert config wording to manuscript object keys format for looping
          switch (config) {
            case "contain_character":
              type = "characters";
              break;
            case "contain_chapter":
              type = "chapters";
              break;
            case "contain_front_matter":
              type = "front_matters";
              break;
            case "contain_back_matter":
              type = "back_matters";
              break;
            default:
          }

          const chaps = this.$store.getters["write/manuscriptProperty"](type);

          if (type != "") {
            for (var i = 0; i < chaps.length; i++) {
              const chap = chaps[i];

              const payload = {
                id: chap.id,
                type: type.slice(0, -1) //removing 's' as it will be put in actions.js
              };

              this.$store
                .dispatch("write/deleteChapter", payload)
                .then(data => {})
                .catch(error => {
                  this.$q.notify({
                    color: "negative",
                    position: "top",
                    message:
                      error.response.data.message || "Something went wrong",
                    icon: "error"
                  });

                  this.chapters.splice(index, 0, chapter);
                });
            }
          }
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error"
          });
        });
    },

    cancelDelete() {
      this.ticked.push(this.difference_option);
      this.confirm_untick = false;
    },

    confirmPublish() {
      //checking if the book has all essential info for publishing
      let err = [];

      if (!this.$store.getters["write/manuscriptProperty"]("title")) {
        err.push("title");
      }
      if (!this.$store.getters["write/manuscriptProperty"]("description")) {
        err.push("description");
      }
      if (!this.$store.getters["write/manuscriptProperty"]("front_cover")) {
        err.push("front_cover");
      }
      if (!this.$store.getters["write/manuscriptProperty"]("back_cover")) {
        err.push("back_cover");
      }

      if (
        this.$store.getters["write/manuscriptProperty"]("title") &&
        this.$store.getters["write/manuscriptProperty"]("description") &&
        this.$store.getters["write/manuscriptProperty"]("front_cover") &&
        this.$store.getters["write/manuscriptProperty"]("back_cover")
      ) {
        this.loading = true;

        this.publish();
      } else {
        let msg =
          "Please fill in these information to publish - " + err.toString();

        this.$q.notify({
          type: "negative",
          message: msg
        });
      }

      this.confirm_publish = false;
    },

    publish() {
      //Function to publish the book

      let book = {
        title: this.$store.getters["write/manuscriptProperty"]("title"),
        description: this.$store.getters["write/manuscriptProperty"](
          "description"
        ),
        front_cover: this.$store.getters["write/manuscriptProperty"](
          "front_cover"
        ),
        back_cover: this.$store.getters["write/manuscriptProperty"](
          "back_cover"
        ),

        author_id: this.$store.getters["write/manuscriptProperty"]("author").id,
        price: 0,
        text: this.$store.getters["write/manuscriptProperty"]("text"),
        publish_date: new Date().toISOString,
        contain_character: this.$store.getters["write/manuscriptProperty"](
          "configs"
        ).contain_character,
        contain_front_matter: this.$store.getters["write/manuscriptProperty"](
          "configs"
        ).contain_front_matter,
        contain_chapter: this.$store.getters["write/manuscriptProperty"](
          "configs"
        ).contain_chapter,
        contain_back_matter: this.$store.getters["write/manuscriptProperty"](
          "configs"
        ).contain_back_matter,
        auto_add_title: this.$store.getters["write/manuscriptProperty"](
          "configs"
        ).auto_add_title
      };

      this.$store
        .dispatch("write/publishBook", book /*, { root: true }*/)
        .then(data => {
          console.log("data", data);
          let book_id = data.data.book.id;

          //this.assembleBook(book_id);
          this.loading = false;

          this.$q.notify({
            color: "positive",
            position: "top",
            message:
              "Yay! Your book has been published successfully on our bookstore",
            icon: "error"
          });

          this.$router.push({
            name: "app-read"
          });
        })
        .catch(error => {
          console.log(error);
          var msg = "";
          try {
            msg = error.response.data.message;
          } catch {
            msg = "Something went wrong. Please try refreshing the page";
          }
          this.$q.notify({
            color: "negative",
            position: "top",
            message: msg,
            icon: "error"
          });
          this.loading = false;
        });
    },

    assembleBook(book_id) {
      //If the response from the server is ok, loop and add each
      //characters, frontmatters, chapters and back matters to the book

      //Adding characters to the book

      //Checking if characters exist
      if (
        this.$store.getters["write/manuscriptProperty"]("configs")
          .contain_character
      ) {
        let characters = this.$store.getters["write/manuscriptProperty"](
          "characters"
        );

        for (var i = 0; i < characters.length; i++) {
          let character = characters[i];
          character.book_id = book_id;
          this.postChapter(character, "characters");
        }
      }

      //Adding front matters to the book

      //Checking if front matters exist
      if (
        this.$store.getters["write/manuscriptProperty"]("configs")
          .contain_front_matter
      ) {
        let front_matters = this.$store.getters["write/manuscriptProperty"](
          "front_matters"
        );

        for (var i = 0; i < front_matters.length; i++) {
          let front_matter = front_matters[i];
          front_matter.book_id = book_id;
          this.postChapter(front_matter, "Front Matter");
        }
      }

      //Adding chapters to the book

      if (
        this.$store.getters["write/manuscriptProperty"]("configs")
          .contain_chapter
      ) {
        let chapters = this.$store.getters["write/manuscriptProperty"](
          "chapters"
        );

        for (var i = 0; i < chapters.length; i++) {
          let chapter = chapters[i];
          chapter.book_id = book_id;
          this.postChapter(chapter, "Chapter");
        }
      }

      //Adding back_matters to the book

      if (
        this.$store.getters["write/manuscriptProperty"]("configs")
          .contain_back_matter
      ) {
        let back_matters = this.$store.getters["write/manuscriptProperty"](
          "back_matters"
        );

        for (var i = 0; i < back_matters.length; i++) {
          let back_matter = back_matters[i];
          back_matter.book_id = book_id;
          this.postChapter(back_matter, "Back Matter");
        }
      }
    },

    postChapter(chap, type) {
      const payload = {
        chapter: chap,
        type: type,
        isBook: true
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
    },

    onRejected(rejectedEntries) {
      this.$q.notify({
        type: "negative",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      });
    }
  }
};
</script>
