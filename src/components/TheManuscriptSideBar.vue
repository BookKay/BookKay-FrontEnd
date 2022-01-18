<template>
  <side-bar-contents
    :contents="navigations"
    @clicked="handleClick"
    @edited="handleEdit"
    @deleted="handleDelete"
  />

  <app-prompt-dialog
    v-for="(dialog, index) in promptDialogs"
    :key="index"
    :open="dialog.state"
    :label="dialog.label"
    :value="dialog.value"
    :rules="dialog.rules"
    @confirmed="dialog.confirmHandler"
  />

  <app-confirm-dialog
    v-for="(dialog, index) in confirmDialogs"
    :key="index"
    :open="dialog.state"
    :header="dialog.label"
    :text="dialog.text"
    :btnLabel="dialog.btnLabel"
    :btnColor="dialog.btnColor"
    @confirmed="dialog.confirmHandler"
  />
</template>
<script>
import SideBarContents from 'src/components/SideBarContents.vue';
import AppPromptDialog from 'src/components/AppPromptDialog.vue';
import AppConfirmDialog from 'src/components/AppConfirmDialog.vue';
import { editorNavigations } from 'src/data/EditorNavigations.js';

export default {
  name: 'TheManuscriptSideBar',
  components: { SideBarContents, AppPromptDialog, AppConfirmDialog },
  props: {
    isReady: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //navigations: editorNavigations,
      navigations: [],
      frontMatterDialog: false,
      chapterDialog: false,
      backMatterDialog: false,

      deleteDialog: false,
      componentToDelete: {},
      deleteType: '',

      editDialog: false,
      componentToEdit: {},
    };
  },
  computed: {
    promptDialogs() {
      return [
        {
          label: 'Add Front Matter',
          state: this.frontMatterDialog,
          value: 'New Front Matter Title',
          rules: [
            (val) => (val !== null && val !== '') || 'Please type your title',
            (val) =>
              val.length <= 100 ||
              'Front Matter title must be smaller than 100',
          ],
          confirmHandler: this.addFrontMatter,
        },
        {
          label: 'Add Chapter Matter',
          state: this.chapterDialog,
          value: 'New Chapter Title',
          rules: [
            (val) => (val !== null && val !== '') || 'Please type your title',
            (val) =>
              val.length <= 100 || 'Chapter title must be smaller than 100',
          ],
          confirmHandler: this.addChapter,
        },
        {
          label: 'Add Back Matter',
          state: this.backMatterDialog,
          value: 'New Back Matter Title',
          rules: [
            (val) => (val !== null && val !== '') || 'Please type your title',
            (val) =>
              val.length <= 100 || 'Back Matter title must be smaller than 100',
          ],
          confirmHandler: this.addBackMatter,
        },
        {
          label: 'Title',
          state: this.editDialog,
          value: this.componentToEdit.caption,
          rules: [
            (val) => (val !== null && val !== '') || 'Please type your title',
            (val) => val.length <= 100 || 'Title must be smaller than 100',
          ],
          confirmHandler: this.editComponent,
        },
      ];
    },

    confirmDialogs() {
      return [
        {
          label: `Delete ${this.deleteType}`,
          state: this.deleteDialog,
          text: `Are you sure you want to delete this ${this.deleteType}?`,
          btnLabel: 'Delete',
          btnColor: 'negative',
          confirmHandler: this.deleteComponent,
        },
      ];
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.syncActive(route);
      },
      deep: true,
      //immediate: true,
    },

    '$props.isReady': {
      handler: function (isReady) {
        if (isReady) {
          this.navigations = this.initNavigations(
            this.$store.state.write.manuscript
          );
          this.syncActive(this.$route);
        }
      },
    },

    '$store.state.write.manuscript': {
      handler: function (route) {
        this.navigations = this.initNavigations(
          this.$store.state.write.manuscript
        );
        this.syncActive(route);
      },
      deep: true,
      //immediate: true,
    },
  },
  mounted() {
    //Initialising the navigations

    let testManuscript = {
      id: 'ab231ad',
      title: 'Ze Book',
      configs: {
        contain_front_matter: true,
        contain_chapter: true,
        contain_back_matter: false,
      },
      front_matters: [
        {
          id: '123',
          title: 'Acknowledgement',
          text: '',
          index: 1,
        },
      ],
      chapters: [
        {
          id: 'abc',
          title: 'The Dawn',
          text: '',
          index: 1,
        },
        {
          id: 'efg',
          title: 'The Dusk',
          text: '',
          index: 2,
        },
      ],
    };
    // this.navigations = this.initNavigations(testManuscript);
    // this.syncActive(this.$route);

    if (this.$props.isReady) {
      this.navigations = this.initNavigations(
        this.$store.state.write.manuscript
      );

      this.syncActive(this.$route);
    }
  },

  methods: {
    //Method to handle when a specific item in sidebar is clicked
    async handleClick(content) {
      if (content.to) {
        //Changing current route and updating active
        await this.$router.push(content.to);
      } else {
        switch (content.data) {
          case 'Add Front Matter':
            this.frontMatterDialog = true;
            break;
          case 'Add Chapter':
            this.chapterDialog = true;

            break;
          case 'Add Back Matter':
            this.backMatterDialog = true;
            break;
          default:
          // code block
        }
      }
    },

    //Handler when delete button is clicked to bring up the delete dialog
    handleDelete(content) {
      if (content.data.startsWith('Front Matter')) {
        this.deleteType = 'Front Matter';
      } else if (content.data.startsWith('Chapter')) {
        this.deleteType = 'Chapter';
      } else if (content.data.startsWith('Back Matter')) {
        this.deleteType = 'Back Matter';
      }
      this.componentToDelete = content;
      this.deleteDialog = true;
    },

    //Method to close the dialog and actually delete the component
    async deleteComponent(result) {
      this.deleteDialog = false;
      if (result) {
        //Converting Front Matter-x = front_matter, Chapter-x = chapter, Back Matter-x = back_matter
        let type = this.componentToDelete.data.split('-')[0];
        type = type.toLowerCase().trim().replace(' ', '-');

        //Forming payload
        let payload = {
          id: this.componentToDelete.id,
          type: type,
        };

        //Sending delete request to api through vuex
        try {
          await this.$store.dispatch('write/deleteComponent', payload);

          //Update the navigations tree
          this.navigations = this.initNavigations(
            this.$store.state.write.manuscript
          );
          this.syncActive(this.$route);

          //If deleted component is the active route redirect to overview page
          if (this.componentToDelete.active) {
            this.$router.replace({
              name: 'write-overview',
              params: {
                manuscript_id:
                  this.$store.getters['write/manuscriptProperty']('id'),
              },
            });
          }
        } catch {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Delete unsuccessful',
            icon: 'error',
          });
        }
      }
    },

    handleEdit(content) {
      this.componentToEdit = content;

      this.editDialog = true;
    },

    async editComponent(title) {
      this.editDialog = false;

      if (title) {
        let type = this.componentToEdit.data.split('-')[0];
        type = type.toLowerCase().trim().replace(' ', '-');

        let payload = {
          component: { title: title },
          id: this.componentToEdit.id,
          type: type,
        };

        try {
          await this.$store.dispatch('write/editComponent', payload);

          //Updated the navigations tree
          this.navigations = this.initNavigations(
            this.$store.state.write.manuscript
          );
          this.syncActive(this.$route);
        } catch {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Edit unsuccessful',
            icon: 'error',
          });
        }
      }
    },

    initNavigations(manuscript) {
      let self = this;

      let navigations = [
        {
          data: 'Overview',
          caption: '',
          to: {
            name: 'write-overview',
            params: { manuscript_id: manuscript.id },
          },
          active: false,
        },
        {
          data: 'Preview',
          caption: '',
          to: {
            name: 'read-book',
            query: { manuscript_id: manuscript.id },
          },
          active: false,
        },
      ];

      if (manuscript.configs.contain_front_matter) {
        //Adding in the front matters
        let data = initComponents('front_matters', 'Front Matter');
        navigations.push(data);
      }

      if (manuscript.configs.contain_chapter) {
        //Adding in the front matters
        let data = initComponents('chapters', 'Chapter');
        navigations.push(data);
      } else {
        let payload = {
          data: `Main Text`,
          caption: manuscript.title,
          to: {
            name: 'write-editor',
            query: { manuscript_id: manuscript.id },
          },
          active: false,
        };
        navigations.push(payload);
      }

      if (manuscript.configs.contain_back_matter) {
        //Adding in the back matters
        let data = initComponents('back_matters', 'Back Matter');
        navigations.push(data);
      }

      return navigations;

      function initComponents(type, name) {
        //Copying the components from manuscript and ordering them by index
        let originalComponents = [...manuscript[type]];

        originalComponents = originalComponents.sort(self.compareIndex);

        //Looping through components and adding them to navigations
        let components = [];

        for (let i = 0; i < originalComponents.length; i++) {
          let component = originalComponents[i];
          let data;

          data = `${name} - ${i + 1}`;

          let payload = {
            data: data,
            caption: component.title,
            to: {
              name: 'write-editor',
              query: {},
            },
            id: component.id,
            delete: true,
            edit: true,
            active: false,
          };

          //Adding in the query
          let lastIndex = type.lastIndexOf('s');
          let queryName = type.substring(0, lastIndex);
          payload.to.query[`${queryName}_id`] = component.id;

          components.push(payload);
        }

        //Adding the 'Add Component' Button
        components.push({
          data: `Add ${name}`,
          caption: '',
        });

        //Finalising data
        let data = {
          data: components,
          caption: '',
          name: `${name}s`,
        };

        return data;
      }
    },

    //Fuctions to order front matters, chapters and back matters
    compareIndex(a, b) {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    },

    //Method to get currently active navigations
    getCurrentNav(navigations) {
      for (let i = 0; i < navigations.length; i++) {
        let nav = navigations[i];

        if (nav.active) {
          return nav;
        } else if (typeof nav.data != 'string') {
          if (this.getCurrentNav(nav.data)) {
            return this.getCurrentNav(nav.data);
          }
        }
      }
    },

    //Method to keep the navigations in sync when the route changes
    syncActive(route) {
      //Inactivating all currently activated navigations
      let currentNav = this.getCurrentNav(this.navigations);
      if (currentNav) {
        currentNav.active = false;
      }

      const routeName = route.name;
      if (routeName == 'write-overview') {
        let overview = this.navigations.find((obj) => {
          return obj.data == 'Overview';
        });
        overview.active = true;
      } else if (routeName == 'write-editor') {
        let queryName = Object.keys(route.query)[0];
        let id = route.query[queryName];
        let components;
        let component;

        switch (queryName) {
          case 'manuscript_id':
            let mainText = this.navigations.find((obj) => {
              return obj.data == 'Main Text';
            });
            mainText.active = true;

            break;
          case 'front_matter_id':
            components = this.navigations.find((obj) => {
              return obj.name == 'Front Matters';
            });

            component = components.data.find((obj) => {
              return obj.id == id;
            });

            component.active = true;

            break;
          case 'chapter_id':
            components = this.navigations.find((obj) => {
              return obj.name == 'Chapters';
            });

            component = components.data.find((obj) => {
              return obj.id == id;
            });

            component.active = true;

            break;
          case 'back_matter_id':
            components = this.navigations.find((obj) => {
              return obj.name == 'Back Matters';
            });
            component = components.data.find((obj) => {
              return obj.id == id;
            });
            component.active = true;

            break;
        }
      }
    },

    //Methods used by prompt dialogs to add component
    addFrontMatter(title) {
      this.frontMatterDialog = false;
      if (title) {
        this.addComponent(title, 'Front Matter');
      }
    },

    addChapter(title) {
      this.chapterDialog = false;
      if (title) {
        this.addComponent(title, 'Chapter');
      }
    },

    addBackMatter(title) {
      this.backMatterDialog = false;
      if (title) {
        this.addComponent(title, 'Back Matter');
      }
    },

    async addComponent(title, type) {
      let text = {
        time: 1634195030352,
        blocks: [
          {
            id: 'mEx28VKFcm',
            type: 'heading',
            data: {
              text: title,
              level: 3,
            },
            tunes: { alignment: { alignment: 'center' } },
          },
        ],
        version: '2.22.2',
      };

      //Mixin for adding new front matter, chapter or back matter
      const payload = {
        component: {
          title: title,
          text: text,
          index: this.$store.getters['write/manuscriptProperty'](
            type.toLowerCase().replace(' ', '_') + 's'
          ).length,
          component_owner_id:
            this.$store.getters['write/manuscriptProperty'](
              'component_owner_id'
            ),
        },
        type: type,
      };

      await this.$store.dispatch('write/addComponent', payload);

      if (this.$props.isReady) {
        this.navigations = this.initNavigations(
          this.$store.state.write.manuscript
        );
        this.syncActive(this.$route);
      }
    },
  },
};
</script>
