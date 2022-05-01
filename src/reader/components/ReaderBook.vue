<template>
  <div>
    <loading-screen v-if="loading" :text="loadingText" />
    <book-page
      :pageNum="1"
      header="title"
      text=""
      class="transparent"
      :class="widthClass"
      :fontSize="fontSize"
      v-if="loading"
      style="opacity: 0"
    />

    <flipbook
      :width="width"
      :height="height"
      size="fixed"
      :usePortrait="true"
      :maxShadowOpacity="0.3"
      :autoSize="true"
      :showCover="true"
      :mobileScrollSupport="true"
      :startZIndex="0"
      :flippingTime="800"
      :disableFlipByClick="true"
      ref="flipbook"
      v-if="!loading"
      id="flipbook"
      v-touch-swipe="handleSwipe"
      @flipbookInit="onFlipbookInit"
      @pageTurned="onPageTurn"
    >
      <book-cover :url="frontCover" />
      <book-page
        v-for="page in pages"
        :key="page.pageNum"
        :pageNum="page.pageNum"
        :header="page.header"
        :text="page.text"
        :fontSize="fontSize"
      />
      <book-cover :url="backCover" />
    </flipbook>
  </div>
</template>

<script>
import Flipbook from './Flipbook.vue';
import BookPage from './ReaderBookPage.vue';
import BookCover from './ReaderBookCover.vue';
import LoadingScreen from './ReaderLoadingScreen.vue';

import handleRequest from '../composables/requestHandler';
import bookRendering from '../composables/bookRendering';
import textAppending from '../composables/textAppending';
import handlePages from '../composables/pagesHandler';
import handleBookCopy from '../composables/bookCopyHandler';

import handleMetaData from '../composables/handleMetaData';
import useHandsFree from 'src/composables/useHandsFree';

//Helper function throttle
import { throttle } from 'quasar';

export default {
  name: 'Book',
  components: {
    // Flipbook: () => import("src/components/reader/Flipbook.vue"),
    // Page: () => import("src/components/reader/Page.vue"),
    // Cover: () => import("src/components/reader/Cover.vue"),
    // LoadingScreen: () => import("src/components/helpers/LoadingScreen.vue"),
    Flipbook,
    BookPage,
    BookCover,
    LoadingScreen,
  },
  created() {
    //Adding event listeners
    document.addEventListener(
      'keydown',
      (e) => {
        this.handleKeyPress(e.key);
      },
      { once: true }
    );

    document.addEventListener(
      'wheel',
      (e) => {
        this.handleScroll(e.deltaY);
      },
      { once: true }
    );
  },

  async mounted() {
    const { fetchManuscript, fetchBook } = handleRequest();
    const { renderBook } = bookRendering();
    const { pages } = handlePages();
    const { loadBookCopy, book_copy } = handleBookCopy();
    const { updateMetaData } = handleMetaData();
    const { useHandsGesture } = useHandsFree();

    //await initHandsFree();
    useHandsGesture((gesture) => {
      if (gesture == 'LeftHandOpened') {
        this.throttledFlipNext();
      } else if (gesture == 'LeftHandClosed') {
        this.throttledFlipPrev();
      }
    });

    this.loadingText = 'Book Loading...Please Wait.';

    if (Object.keys(this.$route.query)[0] == 'manuscript_id') {
      //Fetching the manuscript
      const manuscript = await fetchManuscript();

      //Loading and rendering the book

      this.book = manuscript;
      this.loadingText = 'Configuring Covers';
      this.configureCovers();

      try {
        this.book = renderBook(this.book);
        this.pages = pages;
      } catch (err) {
        this.loadingText = 'Rendering Error :(';
        console.log(err);
      }

      this.loading = false;

      //this.turnToQueryPage();
    }
    if (Object.keys(this.$route.query)[0] == 'book_id') {
      //Fetching the book
      let response;
      let book_id = this.$route.query.book_id;

      //Updating the server for the read
      if (!this.$q.cookies.has(`last_read_${book_id}`)) {
        if (this.$store.getters['user/isLoggedIn']) {
          response = await this.$api.post(`books/${book_id}/read`);
        } else {
          response = await this.$api.get(
            `books/${this.$route.query.book_id}/read`
          );
        }

        //Setting cookies to prevent recalling
        this.$q.cookies.set(`last_read_${book_id}`, '', {
          expires: '1h',
          path: '/',
        });
      }

      let height = screen.height;
      let width = window.innerWidth;

      response = await this.$api.get(`books/${book_id}/copy`, {
        params: { height: height, width: width },
      });

      if (Object.keys(response.data).length == 0) {
        try {
          response = await this.$api.get('books/' + book_id + '/blocks');
        } catch (err) {
          this.loadingText = 'Server Error :(';
          console.log(err);
        }

        const book = response.data;

        //Loading and rendering the book

        this.book = book;

        this.configureCovers();

        try {
          this.loadingText = 'First Time Loading...may take couple of minutes';
          this.book = renderBook(this.book);
          this.pages = pages;

          this.$api.post(`books/${book_id}/copy`, {
            height: height,
            width: width,
            json: book_copy,
          });
          //this.turnToQueryPage();
        } catch (err) {
          this.loadingText = 'Rendering Error :(';
          console.log(err);
        }
      } else {
        this.book = response.data;
        updateMetaData(this.book.title, this.book.description);

        this.configureCovers();
        loadBookCopy(this.book);
        this.pages = pages;
      }

      this.loading = false;
    }
  },
  data() {
    return {
      widthClass: this.$q.screen.lt.sm ? 'full-page' : 'half-page',

      width: this.$q.screen.lt.sm ? window.innerWidth : window.innerWidth / 2,
      height: screen.height,
      loading: true,
      loadingText: '',
      lastScrollTop: 0,

      bookConfigs: {},

      fontSize: 'font-size: 18px',

      singleTags: ['br', 'hr'],

      frontCover: '',
      backCover: '',
      book: {
        title: '',
        front_matters: [],
        chapters: [],
        text: '',
        back_matters: [],
      },
      text: '',
      book_copy: {
        front_matters: [],
        chapters: [],
        main_text: {},
        back_matters: [],
      },

      pages: [],
    };
  },

  watch: {
    $route(to, from) {
      //Clearing out pages, book copy and remaining text
      const { clearPages } = handlePages();
      clearPages();
      const { clearBookCopy } = handleBookCopy();
      clearBookCopy();
      const { emptyRemainingText } = textAppending();
      emptyRemainingText();
    },
  },

  methods: {
    throttledFlipNext: throttle(function () {
      this.$refs.flipbook.flipNext();
    }, 2000),

    throttledFlipPrev: throttle(function () {
      this.$refs.flipbook.flipPrev();
    }, 2000),

    loadPageFlip() {
      setTimeout(() => this.$refs.flipbook.updateFromHtml(), 1000);
    },

    configureCovers() {
      let frontCover = this.book.front_cover;
      let backCover = this.book.back_cover;
      let tempCover = this.book.temp_cover;

      //Setting up front cover url
      this.frontCover = frontCover != '' ? frontCover : tempCover;

      //Setting up back cover url
      this.backCover = backCover != '' ? backCover : tempCover;
    },

    turnToQueryPage() {
      let query = this.$route.query;
      if (
        query.hasOwnProperty('front_matter_id') &&
        front_matters in this.book
      ) {
        //For front matter query

        let front_matters = this.book.front_matters;
        let front_matter = front_matters.find(
          (o) => o.front_matter_id === query.front_matter_id
        );

        this.$refs.flipbook.flip(front_matter.pageNum);
      } else if (query.hasOwnProperty('chapter_id') && chapters in this.book) {
        //For chapter query
        let chapters = this.book.chapters;
        let chapter = chapters.find((o) => o.chapter_id === query.chapter_id);

        this.$refs.flipbook.flip(chapter.pageNum);
      } else if (
        query.hasOwnProperty('back_matter_id') &&
        back_matters in this.book
      ) {
        //For back matter query

        let back_matters = this.book.back_matters;
        let back_matter = back_matters.find(
          (o) => o.back_matter_id === query.back_matter_id
        );

        this.$refs.flipbook.flip(back_matter.pageNum);
      }
    },

    //Handling event listeners on flipbook
    onFlipbookInit() {
      let book_id = this.$route.query.book_id;
      if (Object.keys(this.$route.query) > 0) {
        this.turnToQueryPage();
      }
      if (this.$q.localStorage.has(`pageNumOf_${book_id}`)) {
        let pageNum = this.$q.localStorage.getItem(`pageNumOf_${book_id}`);
        this.$refs.flipbook.flip(pageNum);
      }
    },

    onPageTurn(page) {
      if ('book_id' in this.$route.query) {
        let book_id = this.$route.query.book_id;
        this.$q.localStorage.set(`pageNumOf_${book_id}`, page);
      }
    },

    //Attaching key bindings to turn pages in flipbook
    handleKeyPress(key) {
      //this if is to make lack of flipbook ref fail silently when route changes
      if (this.$refs.flipbook && !this.loading) {
        switch (key) {
          case 'ArrowLeft':
            this.$refs.flipbook.flipPrev();
            break;
          case 'ArrowRight':
            this.$refs.flipbook.flipNext();
            break;
          case 'ArrowDown':
            this.$refs.flipbook.flipNext();
            break;
          case 'ArrowUp':
            this.$refs.flipbook.flipPrev();
            break;
          case 'AudioVolumeUp':
            this.$refs.flipbook.flipNext();
            break;
          case 'AudioVolumeDown':
            this.$refs.flipbook.flipPrev();
            break;
          default:

          // code block
        }

        document.addEventListener(
          'keydown',
          (e) => {
            this.handleKeyPress(e.key);
          },
          { once: true }
        );
      }
    },

    //Attaching scroll to turn pages in flipbook
    handleScroll(scrollDirection) {
      //this if is to make lack of flipbook ref fail silently when route changes
      if (this.$refs.flipbook) {
        if (scrollDirection < 0) {
          this.$refs.flipbook.flipPrev();
        } else if (scrollDirection > 0) {
          this.$refs.flipbook.flipNext();
        }

        document.addEventListener(
          'wheel',
          (e) => {
            this.handleScroll(e.deltaY);
          },
          { once: true }
        );
      }
    },

    //Attaching swiping to turn pages in flipbook for mobile view
    handleSwipe({ /*evt,*/ ...info }) {
      const direction = info.direction;
      if (direction == 'right') {
        //this.$refs.flipbook.flipPrev();
        //Interim solution as prev flipping not working when portrait
        this.$refs.flipbook.turnToPrevPage();
      } else if (direction == 'left') {
        this.$refs.flipbook.flipNext();
      } else if (direction == 'top') {
        this.$emit('swiped', 'top');
      } else if (direction == 'down') {
        this.$emit('swiped', 'down');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// #flipbook {
//   background-image: url('../../../public/reader/pages.png');
// }

.half-page {
  width: 50vw;
  height: 105vh;
}

.full-page {
  width: 100vw;
  height: 105vh;
}
</style>
