<template>
  <q-page class="flex">
    <div class="col">
      <div class="row q-ml-md">
        <h2 class="q-mb-md">Characters</h2>
      </div>

      <q-separator inset />
      <div class="q-mt-md row" :class="alignment">
        <character
          class="col-md-3 col-xs-10"
          v-for="character in this.characters"
          :character="character"
          :key="character.id"
          @nameEditted="editName"
          @personalityEditted="editPersonality"
          @descriptionEditted="editDescription"
          @storylineEditted="editStoryLine"
          @deleted="deleteCharacter"
        />
      </div>

      <add-character-button @characterAdded="addCharacter" />
    </div>
  </q-page>
</template>

<script>
import Character from "src/components/write/Character";
import AddCharacterButton from "src/components/write/AddCharacterButton";

export default {
  components: { Character, AddCharacterButton },
  name: "CharacterPage",
  data() {
    return {};
  },
  computed: {
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
    characters() {
      return this.$store.getters["write/manuscriptProperty"]("characters");
    }
  },
  methods: {
    editName(new_name, character) {
      character.name = new_name;
    },
    editPersonality(new_personality, character) {
      character.personality = new_personality;
    },
    editDescription(new_description, character) {
      character.description = new_description;
    },
    editStoryLine(new_storyline, character) {
      character.storyline = new_storyline;
    },
    deleteCharacter(character) {
      const index = this.characters.indexOf(character);
      this.characters.splice(index, 1);

      const payload = {
        id: character.id,
        type: "character"
      };

      this.$store
        .dispatch("write/deleteChapter", payload /*, { root: true }*/)
        .then(data => {})
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error"
          });

          this.characters.splice(index, 0, character);
        });
    },
    addCharacter(character) {
      this.characters.push(character);
    }
  }
};
</script>
