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
import ManuscriptCard from "src/components/app/ManuscriptCard";
import AddManuscriptButton from "src/components/app/AddManuscriptButton";

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
        .dispatch("user/addManuscript", manuscript)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error"
          });
        });
    },
    deleteManuscript(manuscript) {
      this.$api.delete("manuscripts/" + manuscript.id).then(resp => {
        const user = resp.data;
        this.$store.commit("user/setUser", user);
      });
    }
  }
};
</script>
