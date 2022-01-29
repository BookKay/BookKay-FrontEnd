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
      :maxShadowOpacity="0.5"
      :autoSize="true"
      :showCover="true"
      :mobileScrollSupport="true"
      :startZIndex="0"
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
import Flipbook from 'src/reader/components/Flipbook.vue';
import BookPage from 'src/reader/components/ReaderBookPage.vue';
import BookCover from 'src/reader/components/ReaderBookCover.vue';
import LoadingScreen from 'src/reader/components/ReaderLoadingScreen.vue';

import bookRendering from 'src/reader/composables/bookRendering';
import handlePages from 'src/reader/composables/pagesHandler';

import { useMeta } from 'quasar';

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
    const { renderBook } = bookRendering();
    const { pages, createPage, clearPages } = handlePages();

    this.loadingText = 'Book Loading...Please Wait.';

    if (Object.keys(this.$route.query)[0] == 'manuscript_id') {
      //Fetching the manuscript
      let response;
      try {
        response = await this.$api.get(
          'manuscripts/' + this.$route.query.manuscript_id + '/json'
        );
      } catch (err) {
        this.loadingText = 'Server Error :(';
        console.log(err);
      }

      const manuscript = response.data;

      //Loading and rendering the book

      this.book = manuscript;
      this.loadingText = 'Configuring Covers';
      this.configureCovers();

      try {
        this.book = renderBook(this.book);
        this.pages = pages;
        console.log(pages);
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
          response = await this.$api.get('books/' + book_id + '/json');
          this.pages = pages;
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

          this.$api.post(`books/${book_id}/copy`, {
            height: height,
            width: width,
            json: this.book_copy,
          });
          //this.turnToQueryPage();
        } catch (err) {
          this.loadingText = 'Rendering Error :(';
          console.log(err);
        }
      } else {
        this.book = response.data;
        this.updateMetaData();

        this.configureCovers();
        this.loadBookCopy();
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

  methods: {
    async updateMetaData() {
      //Fetching back the updated user
      let response = await this.$api.get('books/' + this.$route.query.book_id, {
        params: { fields: 'author_name' },
      });

      let author_name = response.data.author_name;

      useMeta(() => {
        return {
          // whenever "title" from above changes, your meta will automatically update
          title: `${this.book.title} | BookKay`,
          meta: {
            description: {
              name: 'description',
              content: this.book.description,
            },
            keywords: {
              name: 'keywords',
              content: `${this.book.title}, ${author_name}, BookKay, ebook`,
            },
            author: { name: 'author', content: author_name },
          },
        };
      });
    },

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

    compareIndex(a, b) {
      if (a.index < b.index) {
        return -1;
      }
      if (a.index > b.index) {
        return 1;
      }
      return 0;
    },

    processClosingTag(text) {
      //To standardize self closing tags
      text = text.split('<br>').join('<br/>');
      text = text.split('<hr>').join('<hr/>');
      text = text.split('<img>').join('<img/>');

      return text;
    },

    loadBookCopy() {
      let pageNum = 1;

      this.$emit('navAdded', {
        type: 'book',
        data: this.book['title'],
        page: pageNum - 1,
        active: false,
      });

      if (!this.$q.screen.lt.sm) {
        this.createPage(pageNum, this.book['title'], ''); // creates the first page
        pageNum++;
      }

      for (const front_matter of this.book['front_matters']) {
        this.$emit('navAdded', {
          type: 'front_matter',
          data: front_matter['title'],
          page: pageNum,
        });

        //Creating pages
        for (const page of front_matter['pages']) {
          this.createPage(pageNum, front_matter['title'], page);
          pageNum++;
        }
      }

      for (const chapter of this.book['chapters']) {
        this.$emit('navAdded', {
          type: 'chapter',
          data: chapter['title'],
          page: pageNum,
        });

        //Creating pages
        for (const page of chapter['pages']) {
          this.createPage(pageNum, chapter['title'], page);
          pageNum++;
        }
      }
      if (Object.keys(this.book['main_text']).length > 0) {
        let main_text = this.book['main_text'];
        //Creating pages
        for (const page of main_text['pages']) {
          this.createPage(pageNum, main_text['title'], page);
          pageNum++;
        }
      }

      for (const back_matter of this.book['back_matters']) {
        this.$emit('navAdded', {
          type: 'back_matter',
          data: back_matter['title'],
          page: pageNum,
        });

        //Creating pages
        for (const page of back_matter['pages']) {
          this.createPage(pageNum, back_matter['title'], page);
          pageNum++;
        }
      }

      if (!this.$q.screen.lt.sm) {
        this.createPage(pageNum, this.book['title'], '');
        pageNum++;

        if (pageNum % 2 == 0) {
          this.createPage(pageNum, this.book['title'], '');
        }
      }
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
    handleSwipe({ evt, ...info }) {
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
.half-page {
  width: 50vw;
  height: 105vh;
}

.full-page {
  width: 100vw;
  height: 105vh;
}
</style>
