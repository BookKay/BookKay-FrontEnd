<template>
  <div>
    <h2 class="sub-heading">Best of the <b>day!</b></h2>
    <div class="row">
      <stand-out-card
        :book="books[0]"
        btnLabel="Read"
        @btnClicked="console.log('clicked')"
        class="col"
      />
      <div class="col" v-if="!$q.screen.lt.md" />
    </div>
  </div>

  <div v-if="books.length > 1" class="books-list">
    <h2 class="sub-heading">Feels like enjoying <b>thriller?</b></h2>
    <simple-book-list
      :books="books"
      primaryLabel="Read"
      @primaryClicked="onPrimaryClicked"
      secondaryLabel="Details"
      @secondaryClicked="onSecondaryClicked"
    />
  </div>

  <div v-if="books.length > 1" class="books-list">
    <h2 class="sub-heading">Feels like enjoying <b>thriller?</b></h2>
    <simple-book-list
      :books="books"
      primaryLabel="Read"
      @primaryClicked="onPrimaryClicked"
      secondaryLabel="Details"
      @secondaryClicked="onSecondaryClicked"
    />
  </div>

  <div v-if="books.length > 1" class="books-list">
    <h2 class="sub-heading">Feels like enjoying <b>thriller?</b></h2>
    <simple-book-list
      :books="books"
      primaryLabel="Read"
      @primaryClicked="onPrimaryClicked"
      secondaryLabel="Details"
      @secondaryClicked="onSecondaryClicked"
    />
  </div>

  <div>
    <linking-box
      class="refresh-link"
      mainText="Haven't found any book that catches your eye?"
      text="Let's refresh then! "
      img="svg/exciting_news.svg"
      label="Let's refresh!"
      @btnClicked="refresh"
    />
  </div>
</template>
<script>
import SimpleBookList from "src/components/book/SimpleBookList.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";
import StandOutCard from "src/components/book/StandOutCard.vue";
export default {
  name: "BookShopList",
  components: { SimpleBookList, LinkingBox, StandOutCard },
  data() {
    return {
      books: [
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
      loading: true,
    };
  },
  methods: {
    refresh() {
      let heading = document.getElementById("shop-heading");

      heading.scrollIntoView({ behavior: "smooth" });
      //this.$refs.pullRefresh.trigger();
    },
  },
};
</script>
<style lang="scss" scoped>
h2 {
  color: #004036;
}

.sub-heading {
  margin: 5px;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 28px;
  line-height: 1.7em;
}

.books-list {
  margin-top: 50px;
}

.refresh-link {
  width: 50vw;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 480px) {
  .refresh-link {
    width: 95vw;
  }
}
</style>
