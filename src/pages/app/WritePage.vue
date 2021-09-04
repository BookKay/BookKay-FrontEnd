<template>
  <q-page>
    <div class="col">
      <div class="row q-ml-md">
        <h2 class="q-mb-md">Manuscripts</h2>
      </div>

      <q-separator inset class="q-mb-md" />

      <div class="row" :class="alignment">
        <manuscript-card
          class="col-md-3 col-sm-6 col-xs-12"
          v-for="manuscript in this.manuscripts"
          :manuscript="manuscript"
          :key="manuscript.id"
          @deleted="deleteManuscript"
        />
      </div>
    </div>

    <add-manuscript-button @manuscriptAdded="addManuscript" />
  </q-page>
</template>

<script>
import ManuscriptCard from "src/components/manuscript/ManuscriptCard";
import AddManuscriptButton from "src/components/manuscript/AddManuscriptButton";

export default {
  components: { ManuscriptCard, AddManuscriptButton },
  name: "WritePage",
  data() {
    return {};
  },
  computed: {
    manuscripts() {
      return this.$store.getters["user/userProperty"]("manuscripts");
    },
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    }
  },
  methods: {
    addManuscript(manuscript) {
      this.$store
        .dispatch("write/addManuscript", manuscript)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error"
          });
        });
    },
    async deleteManuscript(manuscript) {
      let response;

      //Deleting the manuscript and its prototype
      response = await this.$api.delete("manuscripts/" + manuscript.id);
      response = await this.$api.delete(
        "basic-book-prototypes/" + manuscript.prototype_id
      );

      //Getting the updated user
      response = await this.$api.get(
        "users/" + this.$store.getters["user/userProperty"]("id"),
        {
          params: { expand: "~all" }
        }
      );

      let user = response.data;

      //Saving the user
      this.$store.commit("user/setUser", user);
    }
  }
};
</script>
