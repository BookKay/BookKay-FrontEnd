<template>
  <div
    :class="['note-area--' + type, 'note-area-margin--' + type]"
    class="note-area"
  >
    <!--<textarea-autogrow
      :class="['note-area-content--' + type]"
      class="note-area-content"
      :placeholder="placeholder"
      :value="content"
      :minHeight="480"
      :style="
        customStyle ? customStyle : { color: color, 'font-family': fontStyle }
      "
      @input="inputChanged"
      spellcheck="false"
    ></textarea-autogrow>-->
    <q-editor
      :class="['note-area-content--' + type]"
      class="note-area-content"
      :placeholder="placeholder"
      :value="content"
      minHeight="480"
      ref="editor_ref"
      flat
      :style="
        customStyle ? customStyle : { color: color, 'font-family': fontStyle }
      "
      paragraph-tag="p"
      @paste="(evt) => pasteCapture(evt)"
      @input="inputChanged"
      spellcheck="false"
      :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveText,
        },
        strike: {
          key: 9,
        },
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline', 'link'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code'],
          },
        ],
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            options: ['left', 'center', 'right', 'justify'],
          },
        ],
        ['undo', 'redo'],
        ['save'],
      ]"
      v-on:keydown.ctrl.s.prevent.stop="saveText"
    >
    </q-editor>
  </div>
</template>

<script>
import "./css/EmptyLined.css";
import "./css/EmptyLinedColored.css";
import "./css/Texture.scss";
import TextareaAutogrow from "./TextareaAutogrow";

export default {
  //components: { TextareaAutogrow },
  name: "notebook-ui",
  props: {
    type: {
      type: String,
      default: "EmptyLined",
      validator(x) {
        return ["EmptyLined", "EmptyLinedColored", "Texture"].indexOf(x) !== -1;
      },
    },
    color: {
      type: String,
      default: "mediumblue",
    },
    fontStyle: {
      type: String,
      default: `"Handlee", cursive`,
    },
    placeholder: { default: "Write note here" },
    content: { default: "" },
    customStyle: {
      type: Object,
    },
  },
  methods: {
    inputChanged(val) {
      this.$emit("input", val);
    },
    saveText(val) {
      this.$emit("save", this.$props.content);
      //to ensure work has been saved in case the initial request had been ignored due to pending request.

      this.$q.notify({
        message: "Your work has been saved.",
        icon: "save",
        color: "positive",
      });
    },
    pasteCapture(evt) {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          this.$refs.editor_ref.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    },
  },
};
</script>
<style lang="scss"></style>
