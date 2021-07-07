<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        class="q-ma-md"
        fab
        color="primary"
        size="lg"
        icon="add"
        @click="add_section = true"
      />
    </q-page-sticky>

    <q-dialog v-model="add_section" ref="sectionDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="titleInput"
            dense
            v-model="new_title"
            placeholder="Title of your Section"
            :rules="[
              val => (val !== null && val !== '') || 'Please type the title',
              val => val.length <= 100 || 'Title must be smaller than 100'
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent.prevent="$refs.draftInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Draft</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="draftInput"
            dense
            v-model="new_draft"
            placeholder="What shall I include in this section?"
            :rules="[
              val =>
                (val !== null && val !== '') ||
                'Please type the draft of the section'
            ]"
            autogrow
            @keydown.enter.prevent="add"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="
              new_title = '';
              new_draft = '';
            "
          />
          <q-btn flat label="Confirm" @click="add" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "AddCharacterButton",
  data() {
    return {
      new_title: "",
      new_draft: "",

      add_section: false
    };
  },
  methods: {
    add() {
      this.$refs.titleInput.validate();
      this.$refs.draftInput.validate();

      if (!this.$refs.titleInput.hasError && !this.$refs.draftInput.hasError) {
        const section = {
          id: Math.floor(Math.random() * 1000).toString(),
          title: this.new_title,
          draft: this.new_draft
        };
        this.$emit("sectionAdded", section);

        this.new_title = "";
        this.new_draft = "";

        this.$refs.sectionDialog.hide();
      }
    }
  }
};
</script>
