<template>
  <q-page>
    <div class="main-container">
      <div class="top-bar">
        <div class="top-bar__left">
          <q-btn
            color="black"
            icon="self_improvement"
            :label="$q.screen.lt.sm ? '' : 'Zen Mode'"
            flat
            :round="$q.screen.lt.sm"
            :ripple="{ early: true }"
            @click="toggleZen"
          />
        </div>
        <div class="top-bar__center">
          <div class="hotkey-btn">
            <q-btn
              color="black"
              icon="info"
              :label="$q.screen.lt.sm ? '' : 'HotKeys'"
              flat
              :round="$q.screen.lt.sm"
              :rounded="!$q.screen.lt.sm"
              :ripple="{ early: true }"
              @click="hotkeysDialog = true"
            />
          </div>
        </div>
        <div class="top-bar__right">
          <div class="save-status">
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div class="save-status__saved" v-if="savedStatus == 'saved'">
                Saved
                <q-icon name="check_circle" />
              </div>
            </transition>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div v-if="savedStatus == 'saving'" class="save-status__saving">
                Saving
                <q-icon name="edit" />
              </div>
            </transition>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div v-if="savedStatus == 'error'" class="save-status__saving">
                Error
                <q-icon name="error" />
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div class="editor-container">
        <div id="editorContainer">
          <div
            class="editor"
            :class="{
              editor: !$q.fullscreen.isActive,
              editorFull: $q.fullscreen.isActive,
            }"
            ref="editor"
            id="editorjs"
            v-on:keyup.ctrl.up.exact="editor.caret.setToPreviousBlock()"
            v-on:keyup.ctrl.down.exact="editor.caret.setToNextBlock()"
            v-on:keydown.ctrl.s.prevent=""
            @paste="handlePaste"
          ></div>
        </div>
      </div>
    </div>

    <hot-keys-info-dialog
      :open="hotkeysDialog"
      :hotkeys="hotkeys"
      @close="hotkeysDialog = false"
    />
  </q-page>
</template>

<script>
//Importing Components
import HotKeysInfoDialog from 'src/components/HotKeysInfoDialog.vue';

import EditorJS from '@editorjs/editorjs';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';

import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import NestedList from '@editorjs/nested-list';
import Delimiter from '@editorjs/delimiter';
import InlineImage from 'editorjs-inline-image';

//import List from "@editorjs/list";

import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

import { editorHotkeys } from 'src/data/EditorHotKeys.js';

//Helper function debounce
import { debounce } from 'quasar';

export default {
  name: 'EditorPage',
  components: { HotKeysInfoDialog },

  data() {
    return {
      editor: null,
      savedStatus: 'saved',
      hotkeysDialog: false,
      hotkeys: editorHotkeys,

      data: [],
      query: '',
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.editor.destroy();
        this.makeEditor('editorjs');
      },
      deep: true,
      //immediate: true,
    },
  },

  beforeRouteLeave(to, from, next) {
    //this.editor.destroy();
    next();
  },

  mounted() {
    //Initialize the editor

    this.makeEditor('editorjs');

    //Add hotkeys shortcuts
    let self = this;
    document.body.addEventListener(
      'keydown',
      function (ev) {
        // Check for ctrl + F11 for toggling zen mode
        if (ev.ctrlKey && ev.key == 'F11') {
          self.toggleZen();
        }

        // Check for ctrl + / for focusing on editor
        if (ev.ctrlKey && ev.key == '/') {
          self.editor.caret.setToLastBlock('end');
        }
      },
      false
    );
  },

  methods: {
    toggleZen() {
      const target = document.getElementById('editorContainer');

      this.$q.fullscreen
        .toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err);
          // uh, oh, error!!
          // console.error(err)
        });
    },
    async makeEditor(id) {
      await this.initData();

      //Initializing the editor
      const editor = new EditorJS({
        holder: id,

        inlineToolbar: ['bold', 'italic', 'underline', 'link', 'marker'],

        tools: {
          underline: {
            class: Underline,
            shortcut: 'CMD+U',
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+M',
          },

          heading: {
            class: Header,
            //inlineToolbar: ["link"],
            config: {
              placeholder: 'Enter a heading',
              defaultLevel: 3,
            },

            tunes: ['alignment'],
          },
          paragraph: {
            class: Paragraph,
            //inlineToolbar: false,
            tunes: ['alignment'],
          },
          list: {
            class: NestedList,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          image: {
            class: InlineImage,
            inlineToolbar: true,
            config: {
              embed: {
                display: true,
              },
              unsplash: {
                appName: '8MeSNDcetPzIRf3mcLc-_6rrHYPaZnbo6ZSLcAIFniI',
                clientId: 'vVpzIjmedfdCC5ZVrvwhKvsmK1TiIs8h7xY_4pD-49M',
              },
            },
          },

          /*list: {
          class: List,
          inlineToolbar: true,
          tunes: ["alignment"],
        },*/

          alignment: {
            class: AlignmentBlockTune,
            config: {
              default: 'left',
              blocks: {
                header: 'center',
                list: 'left',
              },
            },
          },
        },
        autofocus: true,
        placeholder: 'Let`s write an awesome story!',
        data: this.data,

        onReady: () => {
          const undo = new Undo({ editor });
          undo.initialize(this.data);

          new DragDrop(editor);
          // editor
          //   .save()
          //   .then((outputData) => {
          //     console.log("Article data: ", outputData);
          //   })
          //   .catch((error) => {
          //     console.log("Saving failed: ", error);
          //   });
        },

        onChange: () => {
          this.savedStatus = 'saving';

          //const data = await editor.save();
          editor
            .save()
            .then((outputData) => {
              this.saveText(outputData);
              console.log('Article data: ', outputData);
            })
            .catch((error) => {
              console.log('Saving failed: ', error);
            });
          //console.log(data);
          //console.log("blocks", data[0]);

          // Don't use JSON.stringify() for deep equal.
        },
      });

      this.editor = editor;
    },

    saveText: debounce(async function (text) {
      try {
        await this.saveData(text);
        this.savedStatus = 'saved';
      } catch (err) {
        this.savedStatus = 'error';
      }
    }, 2000),

    async saveData(text) {
      if (this.query == 'manuscript_id') {
        let payload = {
          prototype: { text: text },
          manuscript_id: this.$route.query[this.query],
        };

        await this.$store.dispatch('write/editPrototype', payload);
      } else {
        let payload = {
          component: { text: text },
          id: this.$route.query[this.query],
        };

        let type = this.query.slice(0, -3);
        payload['type'] = type;

        await this.$store.dispatch('write/editComponent', payload);
      }
    },

    async initData() {
      let component;

      if (this.$route.query.hasOwnProperty('front_matter_id')) {
        this.query = 'front_matter_id';
        component = await this.$api.get(
          'front-matters/' + this.$route.query.front_matter_id
        );
      } else if (this.$route.query.hasOwnProperty('chapter_id')) {
        this.query = 'chapter_id';
        component = await this.$api.get(
          'chapters/' + this.$route.query.chapter_id
        );
      } else if (this.$route.query.hasOwnProperty('back_matter_id')) {
        this.query = 'back_matter_id';
        component = await this.$api.get(
          'back-matters/' + this.$route.query.back_matter_id
        );
      } else if (this.$route.query.hasOwnProperty('manuscript_id')) {
        this.query = 'manuscript_id';
        let res = await this.$api.get(
          'manuscripts/' + this.$route.query.manuscript_id
        );

        component = await this.$api.get(
          'default-book-prototypes/' + res.data.prototype_id
        );
      }

      if (Object.keys(this.$route.query).length != 0) {
        this.data = component.data.text;

        if (this.data == '' || this.data == null) {
          this.data = {
            time: 1634195030352,
            blocks: [],
            version: '2.22.2',
          };
        }
      }
    },

    handlePaste() {
      //To overcome bug that does not save new data when immediately saved after being pasted
      //So, I just delay the operation by 0.5 seconds.
      this.savedStatus = 'saving';

      setTimeout(() => {
        this.editor
          .save()
          .then((outputData) => {
            this.saveText(outputData);
            console.log('Article data: ', outputData);
          })
          .catch((error) => {
            console.log('Saving failed: ', error);
          });
      }, 500);
    },
  },

  unmounted() {
    document.removeEventListener('keydown', this.nextItem);
  },
};
</script>

<style lang="scss">
/* .editorx_body {
   width: 62%;
  margin-left: 15%; 
  width: 60%;
  margin-left: 20%;
  border: 2px solid #f1f3f5;
  box-sizing: border-box;
}
.ce-block--focused {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 0.5438550420168067) 35%,
    rgba(0, 212, 255, 1) 100%
  );
} */
.cdx-block {
}

.cdx-block__content {
}

.ce-block__content {
}

.ce-toolbar__content {
  position: static;
}

.ce-toolbar__actions {
  margin-right: 50px;
}

.ce-toolbar__plus {
  margin-left: 50px;
}

.ce-toolbar__plus--hidden {
  display: inline-flex;
}

.ce-toolbox {
  background-color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .ce-toolbar__actions {
    margin-right: 12px;
  }

  .ce-toolbar__plus {
    margin-left: -30px;
    left: 0;
  }

  .cdx-block {
    margin-left: 10px;
    margin-right: 20px;
  }
}

@media (max-width: 550px) {
  .cdx-block {
    margin-left: 10px;
    margin-right: 20px;
  }

  .ce-toolbar {
    box-shadow: none;
    background: transparent;
    border: 0px;
  }

  .ce-toolbar--opened {
    display: block;
  }

  .ce-toolbar__content {
    position: relative;
    display: block;
    margin: 0 auto;
    //width: 100%;
    height: 0;
  }

  .ce-toolbar__actions {
    position: absolute;
    right: -30px;
    top: -25px;
  }

  .ce-toolbar__plus {
    margin-left: 0;
    position: absolute;
    top: -7px;
    left: -20px;
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>

<style lang="scss" scoped>
.main-container {
  width: 90%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.top-bar {
  display: flex;
  align-items: center;

  &__left {
    flex: 1;
  }

  &__center {
    flex: 1;
  }

  &__right {
    flex: 1;
  }
}

.hotkey-btn {
  text-align: center;
}

.zen-btn {
}

.save-status {
  display: grid;
  float: right;

  &__saved {
    grid-area: 1 / 1 / 2 / 2;
  }

  &__saving {
    grid-area: 1 / 1 / 2 / 2;
  }
}

.editor-container {
  background: #eef5fa;
  border-radius: 50px;
  padding-top: 1px;
  padding-bottom: 1px;
  width: 100%;
  margin-top: 10px;
}

.editor {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: auto;
  margin-left: auto;
  padding-top: 30px;
  background: #fff;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  width: 93%;
  min-height: 100vh;
  border-radius: 30px;
  transition: 2s;
}

#editorContainer {
  background: #eef5fa;
}

.editorFull {
  background: #fff;
  width: 100vw;
  height: 100vh;
  margin-right: auto;
  margin-left: auto;
  margin-top: 0;
  border-radius: 0;
  overflow-y: scroll;
}

@media (max-width: 768px) {
  .main-container {
    width: 100%;
  }

  .top-bar {
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media (max-width: 480px) {
  .editor-container {
    border-radius: 25px;
    overflow-x: hidden;
  }

  .editor {
    margin-top: 25px;
    margin-bottom: 25px;
    width: 95vw;
  }

  .editorFull {
    width: 100vw;
    margin: 0 auto;
  }
}
</style>
