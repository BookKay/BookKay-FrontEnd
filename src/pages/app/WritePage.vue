<template>
  <q-page>
    <div class="heading">
      <h1>My Works</h1>
    </div>

    <div>
      <linking-box
        class="write-link"
        mainText="Just got an idea for the next best seller?"
        text="Let's go write that down! What are you waiting for?"
        img="svg/typewriter.svg"
        label="Let's write!"
        @btnClicked="a"
      />
    </div>

    <div>
      <h2 class="sub-heading last-write">Continue <b>writing...</b></h2>
      <quick-book-link :book="manuscripts[0]" @btnClicked="a" />
    </div>

    <div v-if="manuscripts.length > 1" class="manuscripts-list">
      <h2 class="sub-heading">
        Which manuscripts would you like to work <b>today?</b>
      </h2>
      <simple-book-list
        :books="manuscripts"
        primaryLabel="Write"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Details"
        @secondaryClicked="onSecondaryClicked"
      />
    </div>

    <div v-if="manuscripts.length > 0" class="manuscripts-list">
      <h2 class="sub-heading">
        Want to edit back your publised <b>manuscripts?</b>
      </h2>
      <simple-book-list
        :books="manuscripts"
        primaryLabel="Edit"
        @primaryClicked="onPrimaryClicked"
        secondaryLabel="Delete"
        @secondaryClicked="onSecondaryClicked"
      />
    </div>

    <add-manuscript-button @manuscriptAdded="addManuscript" />
  </q-page>
</template>

<script>
import AddManuscriptButton from "src/components/manuscript/AddManuscriptButton";
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import QuickBookLink from "src/components/book/QuickBookLink.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";

export default {
  components: {
    AddManuscriptButton,
    SimpleBookList,
    LinkingBox,
    QuickBookLink,
  },
  name: "WritePage",
  data() {
    return {
      manuscripts: [
        {
          title: "Best Book LOL",
          author_name: "Kevin",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
          id: "1111",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
        },
        {
          title: "Holmes of the Baskervilles",
          author_name: "Sherlock Holmes",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625764942/BookKay/Front%20Cover/front_cover_bd9f4da8-e00c-11eb-bf5b-ba6b82820b1a.png",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
          id: "1112",
        },
        {
          title: "Romeo and Juliet",
          author_name: "Shakespeare",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1113",
        },
        {
          title: "A book",
          author_name: "Kevin",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1114",
        },
        {
          title: "A book",
          author_name: "Kevin",
          front_cover:
            "https://res.cloudinary.com/bookkay/image/upload/v1625743836/BookKay/Front%20Cover/front_cover_6b8784a2-dfd2-11eb-9ec6-d23643d424f6.jpg",
          id: "1115",
        },
      ],
    };
  },
  computed: {
    /*manuscripts() {
      return this.$store.getters["user/userProperty"]("manuscripts");
    },*/
    alignment() {
      return this.$q.screen.lt.md ? "justify-center" : "justify-start";
    },
  },
  methods: {
    addManuscript(manuscript) {
      this.$store
        .dispatch("write/addManuscript", manuscript)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error",
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
          params: { expand: "~all" },
        }
      );

      let user = response.data;

      //Saving the user
      this.$store.commit("user/setUser", user);
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
