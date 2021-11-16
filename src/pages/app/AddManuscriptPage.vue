<template>
  <q-page>
    <div class="page-container">
      <div class="heading">
        <h1>Add Manuscript</h1>
      </div>
      <div class="field">
        <q-input
          outlined
          color="black"
          v-model="manuscript.title"
          label="Title"
          ref="titleInput"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </div>
      <div class="field">
        <q-input
          outlined
          color="black"
          v-model="manuscript.description"
          label="Description"
          type="textarea"
          ref="descriptionInput"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </div>
      <q-separator inset />
      <div class="field">
        <div class="q-ml-md">
          <h4>Types</h4>
        </div>
        <div class="row q-mt-md">
          <book-type-choices
            class="col-4"
            v-for="bookType in this.bookTypes"
            :bookType="bookType"
            :key="bookType.id"
            @typeConfirmed="confirmType"
          />
        </div>

        <div class="field" v-if="configs.contain_front_matter">
          <q-btn
            label="Add Front Matter"
            :ripple="{ early: true }"
            @click="frontMatters.push({ title: '' })"
            class="add-btn"
          />

          <transition-group name="list" tag="div">
            <div
              v-for="(frontMatter, index) in frontMatters"
              :key="index"
              class="list-item"
            >
              <q-input
                outlined
                color="black"
                v-model="frontMatter.title"
                class="component-title q-mb-md"
                label="Title"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="frontMatters.splice(index, 1)"
              />
            </div>
          </transition-group>
        </div>

        <div class="field" v-if="configs.contain_chapter">
          <q-btn
            label="Add Chapter"
            :ripple="{ early: true }"
            @click="chapters.push({ title: '' })"
            class="add-btn"
          />

          <transition-group name="list" tag="div">
            <div
              v-for="(chapter, index) in chapters"
              :key="index"
              class="list-item"
            >
              <q-input
                outlined
                color="black"
                v-model="chapter.title"
                class="component-title q-mb-md"
                label="Title"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="chapters.splice(index, 1)"
              />
            </div>
          </transition-group>
        </div>

        <div class="field" v-if="configs.contain_back_matter">
          <q-btn
            label="Add Back Matter"
            :ripple="{ early: true }"
            @click="backMatters.push({ title: '' })"
            class="add-btn"
          />

          <transition-group name="list" tag="div">
            <div
              v-for="(backMatter, index) in backMatters"
              :key="index"
              class="list-item"
            >
              <q-input
                outlined
                color="black"
                v-model="backMatter.title"
                class="component-title q-mb-md"
                label="Title"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="backMatters.splice(index, 1)"
              />
            </div>
          </transition-group>
        </div>

        <div class="field">
          <q-btn
            color="positive"
            label="Confirm"
            icon="edit"
            :ripple="{ early: true }"
            @click="confirm"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import BookTypeChoices from "src/components/manuscript/BookTypeChoices.vue";

export default {
  name: "MakeManuscriptPage",
  components: { BookTypeChoices },
  data() {
    return {
      configs: {},
      manuscript: {
        title: "",
        description: "",
        temp_cover:
          "https://res.cloudinary.com/bookkay/image/upload/v1624466524/BookKay/Temp%20Cover/Temp_Cover.png",
        author_id: this.$store.getters["user/userProperty"]("id"),
        price: 0.0,
        text: {},
      },

      bookTypes: [
        {
          id: "1",
          name: "Essay",
          configs: {
            contain_character: false,
            contain_chapter: false,
            contain_front_matter: false,
            contain_back_matter: false,
            auto_add_title: true,
          },
          hint: "A simple writing with no chapters and characters",
          chosen: false,
        },
        {
          id: "2",
          name: "Novel(Only chapters) ",
          configs: {
            contain_character: false,
            contain_chapter: true,
            contain_front_matter: false,
            contain_back_matter: false,
            auto_add_title: true,
          },
          hint: "A large long novels with several chapters.",
          chosen: false,
        },
        {
          id: "3",
          name: "Novel",
          configs: {
            contain_character: true,
            contain_chapter: true,
            contain_front_matter: true,
            contain_back_matter: true,
            auto_add_title: true,
          },
          hint: "A large long novels with several front matters, chapters and back matters. Character drafting is automatically switched on.",
          chosen: false,
        },
      ],

      frontMatters: [],
      chapters: [],
      backMatters: [],
    };
  },
  methods: {
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
    },

    confirm() {
      this.$refs.titleInput.validate();
      this.$refs.descriptionInput.validate();

      if (Object.keys(this.configs).length == 0) {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Choose the book type",
          icon: "error",
        });
      }

      if (
        !this.$refs.titleInput.hasError &&
        !this.$refs.descriptionInput.hasError
      ) {
        this.addManuscript;
      }
    },

    async addManuscript(manuscript) {
      try {
        await this.$store.dispatch("write/addManuscript", manuscript);
      } catch {
        this.$q.notify({
          color: "negative",
          position: "top",
          message: error.response.data.message || "Something went wrong",
          icon: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
h1 {
  color: #0d6e5f;
}

h2 {
  color: #004036;
}

.heading {
  display: inline-block;
  border-radius: 50px;
  cursor: pointer;
  background-color: rgba(183, 226, 225);
  padding: 0 20px;
  margin: 5px 10px;
}

.heading h1 {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  font-weight: 700;
  line-height: 2em;
}

.sub-heading {
  margin: 5px;
  margin-left: 20px;
  font-size: 28px;
  line-height: 1.7em;
}

.page-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 50px;
}

.field {
  margin: 20px 0;
}

.add-btn {
  margin-bottom: 20px;
}

.component {
  margin: 10px 0;
}

.component-title {
  float: left;
  width: 90%;
}

.delete-btn {
  float: right;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

//Component List Transitions
.list-item {
  transition: all 0.8s ease;
  margin-right: 10px;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
