<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        class="q-ma-md"
        fab
        color="primary"
        size="lg"
        icon="add"
        @click="add_character = true"
      />
    </q-page-sticky>

    <q-dialog v-model="add_character" ref="characterDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Name</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="nameInput"
            dense
            v-model="character.name"
            placeholder="Name of your character"
            :rules="[
              val => (val !== null && val !== '') || 'Please type the name',
              val => val.length <= 100 || 'Name must be smaller than 100'
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent.prevent="$refs.personalityInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Personality</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="personalityInput"
            dense
            v-model="character.personality"
            placeholder="Traits of your character"
            :rules="[
              val =>
                (val !== null && val !== '') || 'Please type the personality'
            ]"
            autogrow
            @keydown.enter.prevent="$refs.descriptionInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Description</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="descriptionInput"
            dense
            v-model="character.description"
            placeholder="Appearance of your character"
            :rules="[
              val =>
                (val !== null && val !== '') || 'Please type the description'
            ]"
            autogrow
            @keydown.enter.prevent="$refs.storylineInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Storyline</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="storylineInput"
            dense
            v-model="character.storyline"
            placeholder="What will happen to your character throughout the story?"
            :rules="[
              val => (val !== null && val !== '') || 'Please type the storyline'
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
              new_name = '';
              new_personality = '';
              new_description = '';
              new_storyline = '';
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
      character: {
        name: "",
        personality: "",
        description: "",
        storyline: "",
        manuscript_id: this.$store.getters["write/manuscriptProperty"]("id")
      },
      new_name: "",
      new_personality: "",
      new_description: "",
      new_storyline: "",

      add_character: false
    };
  },
  methods: {
    add() {
      this.$refs.nameInput.validate();
      this.$refs.personalityInput.validate();
      this.$refs.descriptionInput.validate();
      this.$refs.storylineInput.validate();

      if (
        !this.$refs.nameInput.hasError &&
        !this.$refs.personalityInput.hasError &&
        !this.$refs.descriptionInput.hasError &&
        !this.$refs.storylineInput.hasError
      ) {
        const payload = {
          chapter: this.character,
          type: "characters"
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

        this.$refs.characterDialog.hide();

        this.character = {
          name: "",
          personality: "",
          description: "",
          storyline: "",
          manuscript_id: this.$store.getters["write/manuscriptProperty"]("id")
        };
      }
    }
  }
};
</script>
