<template>
  <q-select
    label="Genre"
    outlined
    color="black"
    v-model="chosenGenre"
    @update:chosenGenre="$emit('update:chosenGenre', $event.target.value)"
    :options="genreOptions"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, onMounted } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'GenreDropdown',

  setup(props, context) {
    const genreOptions = <string[]>reactive([]);

    onMounted(async () => {
      //Fetching genre options
      let response = await api.get('genres');
      let genres = response.data.results;

      for (const genre of genres) {
        genreOptions.push(genre.name);
      }
    });

    const chosenGenre = ref('');
    watch(chosenGenre, () => {
      context.emit('genreSelected', chosenGenre);
    });

    return { genreOptions, chosenGenre };
  },
});
</script>
