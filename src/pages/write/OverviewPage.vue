<template>
  <q-page class="flex">
    <div class="col">
      <chapters-list
        type="front-matter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_front_matter
        "
      />

      <chapters-list
        type="chapter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs').contain_chapter
        "
      />
      <q-btn
        v-else
        class="q-ma-md"
        label="Edit main body text"
        icon="edit"
        color="primary"
        :to="{
          name: 'write-editor',
          query: {
            manuscript: $store.getters['write/manuscriptProperty']('id')
          }
        }"
      />

      <chapters-list
        type="back-matter"
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_back_matter
        "
      />

      <add-chapter-button
        v-if="
          $store.getters['write/manuscriptProperty']('configs')
            .contain_front_matter ||
            $store.getters['write/manuscriptProperty']('configs')
              .contain_chapter ||
            $store.getters['write/manuscriptProperty']('configs')
              .contain_back_matter
        "
      />
    </div>
  </q-page>
</template>

<script>
import AddChapterButton from "src/components/write/AddChapterButton";
import ChaptersList from "src/components/write/ChaptersList";

import { mapState } from "vuex";

export default {
  components: { ChaptersList, AddChapterButton },
  name: "ChapterPage",
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      count: state => state.module.count // Uses the state of the module
    })
  },
  data() {
    return {
      front_matters: [
        {
          id: "123",
          title: "He Returns",
          draft: "Write about how he returns"
        }
      ],
      chapters: [
        {
          id: "123",
          title: "He Returns",
          draft: "Write about how he returns"
        }
      ],
      back_matters: [
        {
          id: "123",
          title: "He Returns",
          draft: "Write about how he returns"
        }
      ]
    };
  },
  methods: {}
};
</script>
