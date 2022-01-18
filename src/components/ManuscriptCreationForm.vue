<template>
  <q-card class="container">
    <div class="field">
      <q-input
        outlined
        color="black"
        v-model="manuscript.title"
        label="Title"
        ref="titleInput"
        :rules="[(val) => !!val || 'Title is required']"
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
        :rules="[(val) => !!val || 'Description is required']"
      />
    </div>
    <div class="field">
      <q-select
        outlined
        color="black"
        v-model="manuscript.genre_name"
        :options="genreOptions"
        label="Genre"
      />
    </div>
    <q-separator inset />
    <div class="field">
      <div class="q-ml-md">
        <h4>Types</h4>
      </div>
      <div class="row q-mt-md">
        <manuscript-type-choice
          class="col-4"
          v-for="bookType in this.bookTypes"
          :bookType="bookType"
          :key="bookType.id"
          @typeConfirmed="confirmType"
        />
      </div>

      <transition-group name="component-list" tag="div">
        <div
          class="field component-list-item"
          v-if="configs.contain_front_matter"
        >
          <q-btn
            label="Add Front Matter"
            :ripple="{ early: true }"
            @click="addComponent('frontMatters')"
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
                :rules="[(val) => !!val || 'Title is required']"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="deleteComponent('frontMatters', index)"
              />
            </div>
          </transition-group>
        </div>

        <div class="field component-list-item" v-if="configs.contain_chapter">
          <q-btn
            label="Add Chapter"
            :ripple="{ early: true }"
            @click="addComponent('chapters')"
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
                :rules="[(val) => !!val || 'Title is required']"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="deleteComponent('chapters', index)"
              />
            </div>
          </transition-group>
        </div>

        <div
          class="field component-list-item"
          v-if="configs.contain_back_matter"
        >
          <q-btn
            label="Add Back Matter"
            :ripple="{ early: true }"
            @click="addComponent('backMatters')"
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
                :rules="[(val) => !!val || 'Title is required']"
              />
              <q-btn
                color="negative"
                icon="delete"
                :ripple="{ early: true }"
                class="delete-btn"
                @click="deleteComponent('backMatters', index)"
              />
            </div>
          </transition-group>
        </div>
      </transition-group>

      <div class="field">
        <q-card-actions align="right">
          <q-btn
            color="positive"
            label="Confirm"
            icon="edit"
            :ripple="{ early: true }"
            @click="confirm"
          />
        </q-card-actions>
      </div>
    </div>
  </q-card>
</template>

<script>
import ManuscriptTypeChoice from 'src/components/ManuscriptTypeChoice.vue';

export default {
  name: 'MakeManuscriptPage',
  components: { ManuscriptTypeChoice },
  data() {
    return {
      configs: {},
      manuscript: {
        title: '',
        description: '',
        genre_name: '',
        temp_cover:
          'https://storage.googleapis.com/bookkay-dev.appspot.com/temp_covers/temp_cover.png',
        author_id: this.$store.getters['user/userProperty']('id'),
        price: 0.0,
        text: {},
      },

      genreOptions: [],

      bookTypes: [
        {
          id: '1',
          name: 'Essay',
          configs: {
            contain_chapter: false,
            contain_front_matter: false,
            contain_back_matter: false,
          },
          hint: 'A simple writing with no chapters.',
          chosen: false,
        },
        {
          id: '2',
          name: 'Novel(Only chapters) ',
          configs: {
            contain_chapter: true,
            contain_front_matter: false,
            contain_back_matter: false,
          },
          hint: 'A large long novels with several chapters.',
          chosen: false,
        },
        {
          id: '3',
          name: 'Novel',
          configs: {
            contain_chapter: true,
            contain_front_matter: true,
            contain_back_matter: true,
          },
          hint: 'A large long novels with several front matters, chapters and back matters.',
          chosen: false,
        },
      ],

      frontMatters: [],
      chapters: [],
      backMatters: [],
    };
  },
  async mounted() {
    //Fetching genre options
    let response = await this.$api.get('genres');
    let genres = response.data.results;

    for (const genre of genres) {
      this.genreOptions.push(genre.name);
    }
  },
  methods: {
    confirmType(configs) {
      for (let i = 0; i < this.bookTypes.length; i++) {
        let bookType = this.bookTypes[i];
        if (bookType.configs == configs) {
          bookType.chosen = true;
        } else {
          bookType.chosen = false;
        }
      }

      this.configs = configs;
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    addComponent(componentType) {
      this[componentType].push({
        title: `${this.capitalizeFirstLetter(componentType).slice(0, -1)} - ${
          this[componentType].length + 1
        }`,
        index: this[componentType].length,
        text: {
          time: 1634195030352,
          blocks: [
            {
              id: 'mEx28VKFcm',
              type: 'heading',
              data: {
                text: `${this.capitalizeFirstLetter(componentType).slice(
                  0,
                  -1
                )} - ${this[componentType].length + 1}`,
                level: 3,
              },
              tunes: { alignment: { alignment: 'center' } },
            },
          ],
          version: '2.22.2',
        },
      });
    },

    deleteComponent(componentType, index) {
      let deletedIndex = index;
      this[componentType].splice(index, 1);

      for (const frontMatter of this[componentType]) {
        if (frontMatter.index > deletedIndex) {
          frontMatter.index--;
        }
      }
    },

    confirm() {
      this.$refs.titleInput.validate();
      this.$refs.descriptionInput.validate();

      if (Object.keys(this.configs).length == 0) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Choose the book type',
          icon: 'error',
        });
      } else if (this.manuscript.genre_name == '') {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Choose the book genre',
          icon: 'error',
        });
      } else if (
        !this.$refs.titleInput.hasError &&
        !this.$refs.descriptionInput.hasError &&
        this.checkComponents
      ) {
        this.manuscript.configs = this.configs;
        this.manuscript.front_matters = this.frontMatters;
        this.manuscript.chapters = this.chapters;
        this.manuscript.back_matters = this.backMatters;

        this.addManuscript(this.manuscript);

        this.$emit('done');
      }
    },

    checkComponents() {
      let status = true;

      for (const frontMatter of this.frontMatters) {
        if (frontMatter.title == '') {
          status = false;
        }
      }
      for (const chapter of this.chapters) {
        if (chapter.title == '') {
          status = false;
        }
      }
      for (const backMatter of this.backMatters) {
        if (backMatter.title == '') {
          status = false;
        }
      }

      return status;
    },

    async addManuscript(manuscript) {
      let res = await this.$store.dispatch('write/addManuscript', manuscript);
      if (res) {
        this.$router.push({
          name: 'write-overview',
          params: { manuscript_id: res.data.id },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-width: 800px;
  margin-top: 20px;
  margin-bottom: 50px;
  z-index: 5;
}

.field {
  margin: 20px;
  overflow: hidden;
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
.component-list-item {
  transition: all 1s ease;
}

.component-list-enter-from,
.component-list-leave-to {
  opacity: 0;
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

@media (max-width: 780px) {
  .container {
    min-width: 600px;
  }
}

@media (max-width: 480px) {
  .container {
    min-width: 350px;
  }

  .component-title {
    width: 70%;
  }

  .field {
    margin: 10px;
  }
}

@media (max-width: 380px) {
  .container {
    min-width: 300px;
  }
}
</style>
