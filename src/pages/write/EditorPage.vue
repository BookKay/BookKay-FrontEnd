<template>
  <q-page class="flex flex-center" style="overflow: hidden">
    <editor
      :title="title"
      :text="text"
      @textChanged="handleInput"
      ref="editor"
    />
  </q-page>
</template>

<script>
import Editor from "src/components/write/Editor";
export default {
  components: { Editor },
  name: "SectionPage",

  created() {
    if (
      Object.entries(this.$route.query).length === 0 &&
      this.$route.query.constructor === Object
    ) {
      this.$q.notify({
        message: "Your work will not be saved as you are not registered.",
        icon: "warning",
        color: "orange"
      });
    }
  },

  beforeMount() {
    this.loadContents();
  },

  beforeRouteUpdate(to, from, next) {
    this.loadContents(to.query);

    next();
  },

  data() {
    return {
      title: "I am a title",
      text: "Hello my friend. :)",
      type: ""
    };
  },
  methods: {
    handleInput(text) {
      this.text = text;

      //if (payload.save || !this.$store.getters["write/isLoading"]) {
      if (this.type == "manuscript") {
        this.$store
          .dispatch("write/editManuscript", {
            text: this.text
          })
          .then(data => {})
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
      } else {
        this.$store
          .dispatch(
            "write/editChapter",
            {
              chapter: { text: this.text },
              type: this.type,
              id: Object.values(this.$route.query)[0]
            } /*, { root: true }*/
          )
          .then(data => {})
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error"
            });
          });
      }
      //}
    },
    loadContents(queryObj) {
      queryObj = queryObj ? queryObj : this.$route.query;

      const query = Object.keys(queryObj)[0];
      if (query) {
        if (query == "manuscript") {
          this.$api
            .get("manuscripts/" + Object.values(queryObj)[0])
            .then(resp => {
              const manuscript = resp.data;

              this.$store.commit("write/setManuscript", manuscript);
              try {
                this.$q.sessionStorage.set("currentManuscript", manuscript);
              } catch (error) {
                console.log("err", error);
              }
            });
        } else {
          this.$store
            .dispatch(
              "write/getChapter",
              { type: query, id: queryObj[query] } /*, { root: true }*/
            )
            .then(data => {})
            .catch(error => {
              this.$q.notify({
                color: "negative",
                position: "top",
                message: error.response.data.message || "Something went wrong",
                icon: "error"
              });
            });
        }
      }

      switch (query) {
        case "front_matter":
          this.text = this.$store.getters["write/manuscriptProperty"](
            "front_matters"
          ).find(o => o.id === queryObj.front_matter).text;

          this.title = this.$store.getters["write/manuscriptProperty"](
            "front_matters"
          ).find(o => o.id === queryObj.front_matter).title;

          break;
        case "chapter":
          this.text = this.$store.getters["write/manuscriptProperty"](
            "chapters"
          ).find(o => o.id === queryObj.chapter).text;

          this.title = this.$store.getters["write/manuscriptProperty"](
            "chapters"
          ).find(o => o.id === queryObj.chapter).title;

          break;
        case "back_matter":
          this.text = this.$store.getters["write/manuscriptProperty"](
            "back_matters"
          ).find(o => o.id === queryObj.back_matter).text;

          this.title = this.$store.getters["write/manuscriptProperty"](
            "back_matters"
          ).find(o => o.id === queryObj.back_matter).title;

          break;
        case "manuscript":
          this.text = this.$store.getters["write/manuscriptProperty"]("text");
          this.title = this.$store.getters["write/manuscriptProperty"]("title");

          break;
        default:
        // code block
      }

      this.type = query;
    }
  }
};
</script>
