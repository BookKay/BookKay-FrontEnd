<template>
  <q-page>
    <div class="heading">
      <h1>My Works</h1>
    </div>

    <div>
      <linking-card
        class="write-link"
        mainText="Just got an idea for the next best seller?"
        text="Let's go write that down! What are you waiting for?"
        img="svg/typewriter.svg"
        label="Let's write!"
        @btnClicked="addManuscriptDialog = true"
      />
    </div>

    <div v-if="unpublishedManuscripts.length > 0">
      <h2 class="sub-heading last-write">Continue <b>writing...</b></h2>
      <quick-book-link
        :book="unpublishedManuscripts[0]"
        @btnClicked="
          this.$router.push({
            name: 'write-overview',
            params: { manuscript_id: unpublishedManuscripts[0].id },
          })
        "
      />
    </div>

    <div v-if="unpublishedManuscripts.length > 1" class="manuscripts-list">
      <h2 class="sub-heading">
        Which manuscripts would you like to work <b>today?</b>
      </h2>
      <simple-book-list
        :books="unpublishedManuscripts"
        primaryLabel="Write"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="onSecondaryClicked"
      />
    </div>

    <div v-if="publishedManuscripts.length > 0" class="manuscripts-list">
      <h2 class="sub-heading">
        Want to edit back your publised <b>manuscripts?</b>
      </h2>
      <simple-book-list
        :books="publishedManuscripts"
        primaryLabel="Edit"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="onSecondaryClicked"
      />
    </div>

    <q-dialog v-model="addManuscriptDialog" class="dialog">
      <manuscript-creation-form @done="addManuscriptDialog = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import ManuscriptCreationForm from "src/components/ManuscriptCreationForm.vue";
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import QuickBookLink from "src/components/book/QuickBookLink.vue";
import LinkingCard from "src/components/LinkingCard.vue";

export default {
  components: {
    ManuscriptCreationForm,
    SimpleBookList,
    LinkingCard,
    QuickBookLink,
  },
  name: "WritePage",
  data() {
    return {
      addManuscriptDialog: false,
      //manuscripts: [],
      publishedManuscripts: [],
      unpublishedManuscripts: [],
    };
  },
  mounted() {
    // this.manuscripts = this.$store.getters["user/userProperty"]("manuscripts");

    this.initData();
  },
  computed: {
    manuscripts() {
      return this.$store.getters["user/userProperty"]("manuscripts");
    },
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
  },
  // watch: {
  //   "$store.state.user": {
  //     handler: function (user) {

  //       this.manuscripts = user.user.manuscripts;
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },
  methods: {
    initData() {
      for (const manuscript of this.manuscripts) {
        if (manuscript.published) {
          this.publishedManuscripts.push(manuscript);
        } else {
          this.unpublishedManuscripts.push(manuscript);
        }
      }

      //Sorting manuscripts by descending order of last edited time
      this.publishedManuscripts = this.publishedManuscripts.sort((a, b) =>
        a.last_edited.localeCompare(b.last_edited)
      );

      this.unpublishedManuscripts = this.unpublishedManuscripts.sort((a, b) =>
        a.last_edited.localeCompare(b.last_edited)
      );
    },

    async deleteManuscript(manuscript) {
      let response;

      //Deleting the manuscript and its prototype
      response = await this.$api.delete("manuscripts/" + manuscript.id);
      response = await this.$api.delete(
        "default-book-prototypes/" + manuscript.prototype_id
      );

      //Getting the updated user
      response = await this.$api.get(
        "users/" + this.$store.getters["user/userProperty"]("id"),
        {
          params: { expand: "~all" },
        }
      );

      let user = response.data;

      //Saving the user
      this.$store.commit("user/setUser", user);
    },

    onPrimaryClicked(manuscript) {
      this.$router.push({
        name: "write-overview",
        params: { manuscript_id: manuscript.id },
      });
    },

    onSecondaryClicked(manuscript) {
      this.$router.push({
        name: "write-overview",
        params: { manuscript_id: manuscript.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  color: #0d6e5f;
}

h2 {
  color: #004036;
}

.heading {
  display: inline-block;
  border-radius: 50px;
  cursor: pointer;
  background-color: rgba(183, 226, 225);
  padding: 0 20px;
  margin: 5px 10px;
}

.heading h1 {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  font-weight: 700;
  line-height: 2em;
}

.sub-heading {
  margin: 5px;
  margin-left: 20px;
  font-size: 28px;
  line-height: 1.7em;
}

.write-link {
  width: 50vw;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
}

.last-write {
  margin-top: 40px;
  margin-bottom: 20px;
}

.manuscripts-list {
  margin-top: 60px;
}

@media (max-width: 768px) {
  .write-link {
    width: 90vw;
  }
}

@media (max-width: 480px) {
  .sub-heading {
    font-size: 20px;
    margin: 0;
    margin-left: 20px;
  }
}
</style>
