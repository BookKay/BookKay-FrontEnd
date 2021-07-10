<template>
  <div>
    <q-card class="normal-card q-mb-md">
      <q-img :src="url" :ratio="4 / 3">
        <div class="absolute-bottom">
          <div class="text-h6">{{ manuscript.title }}</div>
        </div>
      </q-img>

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
            @click="navigate"
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Delete Dialog -->
    <q-dialog v-model="confirm_delete" persistent ref="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want delete this manuscript. All related data (all
            the things you have written in this manuscript) will be lost.</span
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
  props: {
    manuscript: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      confirm_delete: false
    };
  },
  computed: {
    url: function() {
      let path = this.$props.manuscript.front_cover
        ? this.$props.manuscript.front_cover
        : this.$props.manuscript.temp_cover;
      return path;
    }
  },
  methods: {
    navigate() {
      const id = this.$props.manuscript.id;
      this.$router.push({
        name: "write-overview",
        params: { manuscript_id: id }
      });
    },
    confirmDelete() {
      this.$emit("deleted", this.$props.manuscript);
    }
  }
};
</script>

<style lang="scss" scoped namespaced>
.manuscript-card {
  width: 100%;
  max-width: 250px;
}
</style>
