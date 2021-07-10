<template>
  <q-page>
    <q-dialog v-model="info">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Info</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p>
            ***The different formatting options won't be appearing
            accordingly(all will be the same). However, it will be rendered
            appropriately at the reader's side when published.
          </p>
          <p>
            - All progress are automatically saved and sync with our cloud
            storage. So, it is perfectly fine to not click save button.
          </p>
          <p>
            - Paragraph formattings will have an automatic first-line indent at
            the readers. So, you are not required to indent manually.
          </p>
          <p>
            - Please do try out our zen mode &#128521;
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="row q-ma-sm">
      <q-btn
        class="q-ma-sm"
        color="primary"
        label="Zen Mode"
        icon="self_improvement"
        @click="enableZen"
      />
    </div>

    <div class="row text-h6 q-ma-lg items-center">
      <!--<div class="q-py-sm col-shrink">Title:</div>
      <q-input
        ref="titleInput"
        outlined
        v-model="new_title"
        placeholder="What title shall we name this?"
        class="q-pl-md col"
        autogrow
        lazy-rules
        :rules="[
          val => (val !== null && val !== '') || 'Please type your title'
        ]"
        @input="titleChanged"
      />-->
      <h2 class="q-ma-md">{{ $props.title }}</h2>
    </div>

    <notebook-ui
      :customStyle="{
        color: `orange`,
        'text-decoration': 'bold'
      }"
      ref="notebook"
      :content="new_text"
      placeholder="Let's write your story!!!"
      type="Texture"
      color="red"
      class="window-width"
      @input="textChanged"
      @save="handleSave"
    ></notebook-ui>

    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px; max-width: 300px;"
      :class="{ hidden: !isFullScreen }"
      :visible="false"
      id="notebook"
    >
      <notebook-ui
        :customStyle="{
          color: `orange`
        }"
        ref="notebook"
        :content="new_text"
        placeholder="Let's write your story!!!"
        type="Texture"
        color="black"
        class="window-width"
        style="min-height: 100vh; border-radius: 0;"
        @input="textChanged"
        @save="handleSave"
      ></notebook-ui>
    </q-scroll-area>
  </q-page>
</template>

<script>
import NotebookUi from "src/components/editor/NotebookUI";

export default {
  components: { NotebookUi },
  name: "Editor",

  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  watch: {
    "$q.fullscreen.isActive"(val) {
      this.isFullScreen = val;
    },
    "$props.text"(val) {
      this.new_text = val;
    }
  },
  data() {
    return {
      info: true,

      new_title: this.$props.title,
      new_text: this.$props.text,
      isFullScreen: false,
      isEditing: true,

      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "orange",
        width: "5px",
        opacity: 0.75
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "orange",
        width: "9px",
        opacity: 0.2
      }
    };
  },
  methods: {
    enableZen() {
      const target = document.getElementById("notebook");

      this.$q.fullscreen
        .toggle(target)
        .then(() => {})
        .catch(err => {
          alert(err);
          // uh, oh, error!!
          // console.error(err)
        });
    },
    textChanged(val) {
      this.new_text = val.text;

      this.$emit("textChanged", val);
    },

    titleChanged(val) {
      this.$refs.titleInput.validate();

      if (!this.$refs.titleInput.hasError) {
        val = val.replace(/(\r\n|\n|\r)/gm, "");
        this.new_title = val;
        this.$emit("titleChanged", val);
      }
    },
    preventNav(event) {
      if (!this.isEditing) return;
      event.preventDefault();
      event.returnValue = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-appear {
  overflow: scroll !important;
  overflow-x: hidden !important;
  overflow-y: scroll !important;
}
</style>
