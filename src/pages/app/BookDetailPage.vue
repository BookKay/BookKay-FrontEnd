<template>
  <q-page>
    <div class="book">
      <img :src="book.front_cover" alt="Front Cover" class="bg-img" />
      <div class="book-contents">
        <div class="col">
          <div class="book-text">
            <h1 class="title">{{ book.title }}</h1>
            <p class="description">{{ book.description }}</p>
          </div>
          <div class="book-img">
            <q-btn
              color="white"
              text-color="black"
              filled
              rounded
              label="Read"
              :ripple="{ early: true }"
              class="read-btn"
            />
          </div>
        </div>
        <div class="col">
          <img :src="book.front_cover" alt="Front Cover" class="front-cover" />
        </div>
      </div>
    </div>

    <div>
      <div class="chapters-container row">
        <quick-link
          :primaryText="`Chapter - ${index + 1}`"
          :secondaryText="chapter.title"
          @btnClicked="a"
          v-for="(chapter, index) in book.chapters"
          :key="chapter.id"
          class="chapter col-6 col-md-5"
        />
      </div>
    </div>

    <div class="row info-container">
      <linking-box
        class="col-12 col-sm-6"
        mainText="General Information"
        img="svg/information_tab.svg"
      >
        <q-list
          bordered
          separator
          :dense="$q.screen.lt.md"
          class="q-mt-md"
          style="border-radius: 30px"
        >
          <q-item clickable v-ripple>
            <q-item-section>Author: {{ book.author_name }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >Price:
              {{ book.price == 0.0 ? "Free" : book.price }}</q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section
              >Date Published: {{ book.publish_date }}</q-item-section
            >
          </q-item>
        </q-list>
      </linking-box>
      <div class="col-sm-6"></div>
    </div>
    <div class="row stats-container">
      <div class="col-sm-6"></div>
      <linking-box
        class="col-12 col-sm-6"
        mainText="Numerical Data"
        img="svg/growing.svg"
      >
        <q-list
          bordered
          separator
          :dense="$q.screen.lt.md"
          class="q-mt-md"
          style="border-radius: 30px"
        >
          <q-item clickable v-ripple>
            <q-item-section>No. of Reads:1</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>No. of Purchases: 2</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>No. of Reads:3</q-item-section>
          </q-item>
        </q-list>
      </linking-box>
    </div>
  </q-page>
</template>

<script>
import QuickLink from "src/components/book/QuickLink.vue";
import LinkingBox from "src/components/helpers/LinkingBox.vue";

export default {
  name: "BookDetailPage",
  components: { QuickLink, LinkingBox },
  /*mounted() {
    this.$api.get("books/" + this.$route.params.book_id).then(resp => {
      const book = resp.data;

      this.book = book;
      console.log(book);
    });
  },*/
  computed: {
    getPublishDate() {
      let date = new Date(this.book.publish_date);

      return date.toDateString();
    },
    getPurchasesNum() {
      return this.book.purchases.length;
    },
  },
  data() {
    return {
      book: {
        title: "Best Book LOL hohoo a very lonnnnnnnnnngggg title",
        author_name: "Kevin",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
        id: "1111",
        price: 0,
        front_cover:
          "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
        chapters: [
          { title: "A new life", id: "1" },
          { title: "A tragedy", id: "2" },
          { title: "Hoho", id: "3" },
          { title: "OMG", id: "4" },
          { title: "The Finale", id: "5" },
        ],
      },
    };
  },
};
</script>
<style lang="scss" scoped>
img {
  height: 400px;
  width: 300px;
}

.book {
  overflow: hidden;
  position: relative;
  width: 100%;
  //height: 80vh;
  border-radius: 0 0 50px 50px;
}

.bg-img {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
  opacity: 0.1;
}

.book-contents {
  display: -webkit-flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 30px;
}

.book-text {
  //margin-left: 60px;
  margin-bottom: 30px;
}

.title {
  font-weight: 700;
  font-size: 22px;
  line-height: 35px;
  padding: 0;
  margin: 0;
}

.description {
  font-size: 14px;
  font-weight: 300;
  padding: 0;
  margin: 0;
  margin-top: 20px;
  text-align: justify;
}

.front-cover {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
  background-size: contain;
  background-repeat: no-repeat;
}

.read-btn {
  margin-left: auto;
  margin-right: auto;
  width: 20vw;
  display: block;
}

.chapters-container {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
}

.chapter {
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
}

.info-container {
  margin-top: 80px;
  margin-left: 20px;
  margin-right: 20px;
}

.stats-container {
  margin-left: 20px;
  margin-right: 20px;
}

@media (max-width: 480px) {
  .front-cover {
    height: 60vw;
    width: 40vw;
    margin: 0 5px;
    border-radius: 20px;
  }

  .book-contents {
    margin: 5px;
    margin-left: 10px;
  }

  .title {
    height: 65px;
    width: 150px;
    margin-left: 10px;
    //margin-right: 10px;
    overflow: hidden;
  }

  .description {
    height: 140px;
    margin-left: 10px;
    margin-right: 10px;
    overflow: hidden;
    font-size: 12px;
  }

  .read-btn {
    width: 50vw;
    margin-bottom: 10px;
  }

  .chapter {
    margin: 10px 15px;
  }

  .stats-container {
    margin-top: 40px;
  }
}
</style>
