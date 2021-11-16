<template>
  <div>
    <q-card class="q-mb-md normal-card">
      <q-card-section>
        <div class="items-center no-wrap">
          <div
            class="text-h6 ellipsis relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_name = true"
          >
            Name:
            <span class="text-body1 q-pa-sm text">{{ character.name }}</span>
          </div>
          <div
            class="text-h6 relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_personality = true"
          >
            Personality:
            <span class="text-body1 q-pa-sm text">{{
              character.personality
            }}</span>
          </div>
          <div
            class="text-h6 relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_description = true"
          >
            Description:
            <span class="text-body1 q-pa-sm text">{{
              character.description
            }}</span>
          </div>
          <div
            class="text-h6 relative-position q-mb-sm q-pl-sm"
            v-ripple
            @click="edit_storyline = true"
          >
            Storyline:
            <span class="text-body1 q-pa-sm text">{{
              character.storyline
            }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-end">
        <div class="row">
          <q-btn
            icon="delete"
            color="negative"
            round
            flat
            @click="confirm_delete = true"
          />
        </div>
        <div class="row">
          <q-btn
            label="Edit"
            color="primary"
            class="q-ml-md"
            @click="edit_all = true"
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Dialogs -->

    <!-- Name Dialog -->
    <q-dialog v-model="edit_name" ref="nameDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Name</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="nameInput"
            dense
            v-model="new_name"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type the name',
              (val) => val.length <= 100 || 'Name must be smaller than 100',
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="confirm('name')"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_name = $props.character.name"
          />
          <q-btn flat label="Confirm" @click="confirm('name')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Personality Dialog -->
    <q-dialog v-model="edit_personality" ref="personalityDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Personality</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="personalityInput"
            dense
            v-model="new_personality"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the personality',
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="confirm('personality')"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_personality = $props.character.personality"
          />
          <q-btn flat label="Confirm" @click="confirm('personality')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Description Dialog -->
    <q-dialog v-model="edit_description" ref="descriptionDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Description</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="descriptionInput"
            dense
            v-model="new_description"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the description',
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="confirm('description')"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_description = $props.character.description"
          />
          <q-btn flat label="Confirm" @click="confirm('description')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Storyline Dialog -->
    <q-dialog v-model="edit_storyline" ref="storylineDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Storyline</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="storylineInput"
            dense
            v-model="new_storyline"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the storyline',
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="confirm('storyline')"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="new_storyline = $props.character.storyline"
          />
          <q-btn flat label="Confirm" @click="confirm('storyline')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- All Dialog -->
    <q-dialog v-model="edit_all" ref="allDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Name</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="nameInput"
            dense
            v-model="new_name"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type the name',
              (val) => val.length <= 100 || 'Name must be smaller than 100',
            ]"
            autofocus
            autogrow
            @keydown.enter.prevent="$refs.personalityInput.focus()"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Personality</div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          ><q-input
            ref="personalityInput"
            dense
            v-model="new_personality"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the personality',
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
            v-model="new_description"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the description',
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
            v-model="new_storyline"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type the storyline',
            ]"
            autogrow
            @keydown.enter.prevent="confirm('all')"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="Cancel"
            v-close-popup
            @click="
              new_name = $props.character.name;
              new_personality = $props.character.personality;
              new_description = $props.character.description;
              new_storyline = $props.character.storyline;
            "
          />
          <q-btn flat label="Confirm" @click="confirm('all')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Delete Dialog -->
    <q-dialog v-model="confirm_delete" persistent ref="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want delete? All related data of the character
            will be lost</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
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
  </div>
</template>

<script>
export default {
  name: "Character",
  props: {
    character: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      new_name: this.$props.character.name,
      new_personality: this.$props.character.personality,
      new_description: this.$props.character.description,
      new_storyline: this.$props.character.storyline,

      edit_name: false,
      edit_personality: false,
      edit_description: false,
      edit_storyline: false,
      edit_all: false,
      confirm_delete: false,
    };
  },
  methods: {
    confirm(property) {
      let data = {};

      switch (property) {
        case "name":
          this.$refs.nameInput.validate();

          if (!this.$refs.nameInput.hasError) {
            this.$emit("nameEditted", this.new_name, this.character);

            data.name = this.new_name;

            this.$refs.nameDialog.hide();
          }
          break;
        case "personality":
          this.$refs.personalityInput.validate();

          if (!this.$refs.personalityInput.hasError) {
            this.$emit(
              "personalityEditted",
              this.new_personality,
              this.character
            );

            data.personality = this.new_personality;

            this.$refs.personalityDialog.hide();
          }
          break;
        case "description":
          this.$refs.descriptionInput.validate();

          if (!this.$refs.descriptionInput.hasError) {
            this.$emit(
              "descriptionEditted",
              this.new_description,
              this.character
            );

            data.description = this.new_description;

            this.$refs.descriptionDialog.hide();
          }
          break;
        case "storyline":
          this.$refs.storylineInput.validate();

          if (!this.$refs.storylineInput.hasError) {
            this.$emit("storylineEditted", this.new_storyline, this.character);

            data.storyline = this.new_storyline;

            this.$refs.storylineDialog.hide();
          }
          break;
        case "all":
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
            this.$emit("nameEditted", this.new_name, this.character);
            this.$emit(
              "personalityEditted",
              this.new_personality,
              this.character
            );
            this.$emit(
              "descriptionEditted",
              this.new_description,
              this.character
            );
            this.$emit("storylineEditted", this.new_storyline, this.character);

            data.name = this.new_name;
            data.personality = this.new_personality;
            data.description = this.new_description;
            data.storyline = this.new_storyline;

            this.$refs.allDialog.hide();
          }
          break;
        default:
        // code block
      }

      const payload = {
        chapter: data,
        id: this.$props.character.id,
        type: "character",
      };

      this.$store
        .dispatch("write/editChapter", payload /*, { root: true }*/)
        .then((data) => {})
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error",
          });
        });
    },

    confirmDelete() {
      this.$emit("deleted", this.character);

      this.$refs.deleteDialog.hide();
    },
  },
};
</script>

<style lang="scss" scoped namespaced>
.text {
  font-size: 1.2rem;
  hyphens: auto;
}

.text-h6 {
  cursor: pointer;
}
</style>
