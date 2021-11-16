<template>
  <div>
    <loading-screen v-if="loading" :text="loadingText" />
    <page
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
      <cover :url="frontCover" />
      <page
        v-for="page in pages"
        :key="page.pageNum"
        :pageNum="page.pageNum"
        :header="page.header"
        :text="page.text"
        :fontSize="fontSize"
      />
      <cover :url="backCover" />
    </flipbook>
  </div>
</template>

<script>
import Flipbook from "src/components/reader/Flipbook.vue";
import Page from "src/components/reader/Page.vue";
import Cover from "src/components/reader/Cover.vue";
import LoadingScreen from "src/components/helpers/LoadingScreen.vue";

export default {
  name: "Book",
  components: { Flipbook, Page, Cover, LoadingScreen },
  created() {
    //Adding event listeners
    document.addEventListener(
      "keydown",
      (e) => {
        this.handleKeyPress(e.key);
      },
      { once: true }
    );

    document.addEventListener(
      "wheel",
      (e) => {
        this.handleScroll(e.deltaY);
      },
      { once: true }
    );
  },

  async mounted() {
    const self = this;

    this.loadingText = "Book Loading...Please Wait";

    if (Object.keys(this.$route.query)[0] == "manuscript_id") {
      //Fetching the manuscript
      let response;
      try {
        response = await this.$api.get(
          "manuscripts/" + this.$route.query.manuscript_id + "/json"
        );
      } catch (err) {
        this.loadingText = "Server Error :(";
        console.log(err);
      }

      const manuscript = response.data;

      //Loading and rendering the book

      this.book = manuscript;
      this.loadingText = "Configuring Covers";
      this.configureCovers();

      try {
        this.book = renderBook(this.book);
      } catch (err) {
        this.loadingText = "Rendering Error :(";
        console.log(err);
      }

      this.loading = false;

      this.turnToQueryPage();
    }
    if (Object.keys(this.$route.query)[0] == "book_id") {
      //Fetching the book
      let response;
      let book_id = this.$route.query.book_id;

      try {
        response = await this.$api.get("books/" + book_id + "/json");
      } catch (err) {
        this.loadingText = "Server Error :(";
        console.log(err);
      }

      const book = response.data;

      //Updating the server for the read
      if (!this.$q.cookies.has(`last_read_${book_id}`)) {
        if (this.$store.getters["user/isLoggedIn"]) {
          response = await this.$api.post(`books/${book_id}/read`);
        } else {
          response = await this.$api.get(
            `books/${this.$route.query.book_id}/read`
          );
        }

        //Setting cookies to prevent recalling
        this.$q.cookies.set(`last_read_${book_id}`, null, {
          expires: "1h",
          path: "/",
        });
      }

      //Loading and rendering the book

      this.book = book;
      this.loadingText = "Configuring Covers";
      this.configureCovers();
      try {
        this.book = await renderBook(this.book);
        this.turnToQueryPage();
      } catch (err) {
        this.loadingText = "Rendering Error :(";
        console.log(err);
      }

      this.loading = false;
    }

    async function renderBook(book) {
      var pageNum = 1;

      self.$emit("navAdded", {
        type: "book",
        data: book["title"],
        page: pageNum - 1,
        active: false,
      });

      if (!self.$q.screen.lt.sm) {
        createPage(pageNum, book["title"], ""); // creates the first page
        pageNum++;
      }

      if ("front_matters" in book) {
        var front_matters = book["front_matters"];

        for (var i = 0; i < front_matters.length; i++) {
          let front_matter = front_matters[i];

          //Updating loading text
          self.loadingText = `Rendering ${front_matter["title"]}`;

          front_matter["page"] = pageNum;

          self.$emit("navAdded", {
            type: "front_matter",
            data: front_matter["title"],
            page: pageNum,
          });

          pageNum = paginateText(
            front_matter["text"],
            pageNum,
            front_matter["title"]
          );

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, front_matter["title"], page);
            document.getElementsByClassName("page-text")[0].innerHTML = "";
            pageNum++;
          }
        }
      }

      if ("chapters" in book && book.chapters.length > 0) {
        var chapters = book["chapters"];

        for (var i = 0; i < chapters.length; i++) {
          let chapter = chapters[i];

          //Updating loading text
          self.loadingText = `Rendering ${chapter["title"]}`;

          chapter["page"] = pageNum;

          self.$emit("navAdded", {
            type: "chapter",
            data: chapter["title"],
            page: pageNum,
          });

          pageNum = paginateText(chapter["text"], pageNum, chapter["title"]);

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, chapter["title"], page);
            document.getElementsByClassName("page-text")[0].innerHTML = "";
            pageNum++;
          }
        }
      } else if (book.text != "" && book.text != null) {
        //Updating loading text
        self.loadingText = `Rendering the main text`;

        self.$emit("navAdded", {
          type: "text",
          data: book["title"],
          page: pageNum,
        });

        pageNum = paginateText(book["text"], pageNum, book["title"]);

        var page = document.getElementsByClassName("page-text")[0].innerHTML;
        if (page != "") {
          createPage(pageNum, book["title"], page);
          document.getElementsByClassName("page-text")[0].innerHTML = "";
          pageNum++;
        }
      }

      if ("back_matters" in book) {
        var back_matters = book["back_matters"];
        for (var i = 0; i < back_matters.length; i++) {
          let back_matter = back_matters[i];

          //Updating loading text
          self.loadingText = `Rendering ${back_matter["title"]}`;

          self.$emit("navAdded", {
            type: "back_matter",
            data: back_matter["title"],
            page: pageNum,
          });

          pageNum = paginateText(
            back_matter["text"],
            pageNum,
            back_matters[i]["title"]
          );

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, back_matter["title"], page);
            document.getElementsByClassName("page-text")[0].innerHTML = "";
            pageNum++;
          }
        }
      }

      if (!self.$q.screen.lt.sm) {
        createPage(pageNum, book["title"], "");
        pageNum++;

        if (pageNum % 2 == 0) {
          createPage(pageNum, book["title"], "");
        }
      }

      //Updating the loading text
      self.loadingText = "Rendering Done!";

      return book;
    }

    function paginateText(DOM, pageNum, title, tags = []) {
      if (
        "attributes" in DOM &&
        "id" in DOM["attributes"] &&
        DOM["attributes"]["id"] == "RootDivContainer"
      ) {
        //To ignore the enclosing root container
      } else {
        var openingTag =
          "attributes" in DOM
            ? getOpeningTag(DOM["type"], DOM["attributes"])
            : getOpeningTag(DOM["type"]);
        var closingTag = getClosingTag(DOM["type"]);

        var pageText = appendToLastPage(openingTag + closingTag, tags);
        if (pageText != "") {
          // checks if word could not be filled in last page
          createPage(pageNum, title, pageText); // create new empty page
          pageText = appendToLastPage(openingTag + closingTag, tags); // fill the word in the new last element
          pageNum++;
        }

        tags.push({
          openingTag: openingTag,
          closingTag: closingTag,
        });
      }

      if (DOM["contents"]) {
        for (var i = 0; i < DOM["contents"].length; i++) {
          var content = DOM["contents"][i];

          //check if content is string(text to render)
          if (typeof content == "string") {
            content = escapeHtml(content);

            var words = content.split(" ");

            for (var j = 0; j < words.length; j++) {
              var word = words[j] + " ";

              var pageText = appendToLastPage(word, tags);
              if (pageText != "") {
                // checks if word could not be filled in last page
                createPage(pageNum, title, pageText); // create new empty page
                var lastTags = []; //array to store the tags that have been appended to page

                //looping through each tags and inserting them in the next page
                for (var index = 0; index < tags.length; index++) {
                  var tag = tags[index];

                  var lastPage =
                    self.pages[self.pages.length - 1].text.split(" "); //text of last page

                  if (
                    tag["openingTag"].startsWith("<p") &&
                    lastPage[lastPage.length - 2] != "<p></p>"
                  ) {
                    //to prevent the indentation of paragraph when overflowing to the next page
                    //this is due to the fact that all p tags have automatic text indent thanks to css
                    pageText = appendToLastPage(
                      "<p style='text-indent: 0'>" + tag["closingTag"],
                      lastTags
                    );
                  } else {
                    pageText = appendToLastPage(
                      tag["openingTag"] + tag["closingTag"],
                      lastTags
                    ); // fill the word in the new last element
                  }

                  lastTags.push(tag);
                }

                pageText = appendToLastPage(word, tags);

                pageNum++;
              }
            }
          } else if (self.singleTags.includes(content.type)) {
            //check if content is a self closing tag
            var word = "<" + content.type + "/>";
            var pageText = appendToLastPage(word, tags);

            if (pageText != "") {
              // checks if word could not be filled in last page
              createPage(pageNum, title, pageText); // create new empty page
              pageText = appendToLastPage(word, tags);

              pageNum++;
            }
          } else {
            //if content is an object
            pageNum = paginateText(content, pageNum, title, tags);
            tags.pop();
          }
        }
      }
      return pageNum;
    }

    function createPage(pageNum, header, text) {
      var page = {
        header: header,
        pageNum: pageNum,
        text: text,
      };
      self.pages.push(page);
    }

    function checkOverflow(el) {
      var curOverflow = el.style.overflow;

      if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "hidden";

      var isOverflowing =
        el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

      el.style.overflow = curOverflow;

      return isOverflowing;
    }

    function appendToLastPage(word, tags = []) {
      var page = document.getElementsByClassName("page-text")[0]; // gets the fake page
      var pageText = page.innerHTML; // gets the text from the last page
      var originalText = pageText;

      if (tags.length > 0) {
        let lastTag = tags[tags.length - 1]["closingTag"];
        let lastTagCount = 1;

        for (let i = 0; i < tags.length - 1; i++) {
          let tag = tags[i];
          if (tag["closingTag"] == lastTag) {
            lastTagCount++;
          }
        }

        let lastOccurance = nthLastIndexOf(pageText, lastTag, lastTagCount);

        var suffix = pageText.slice(lastOccurance);
        pageText = pageText.slice(0, lastOccurance);
        pageText = pageText + word + " " + suffix;

        page.innerHTML = pageText;
      } else {
        page.innerHTML += word + " "; // saves the text of the last page
      }
      if (checkOverflow(page)) {
        // checks if the page overflows (more words than space)
        page.innerHTML = ""; //resets the page-text
        return originalText; // returns false because page is full
      } else {
        return ""; // returns true because word was successfully filled in the page
      }
    }

    function nthLastIndexOf(string, searchString, n) {
      if (string === null) {
        return -1;
      }
      if (!n || isNaN(n) || n <= 1) {
        return string.lastIndexOf(searchString);
      }
      n--;
      return string.lastIndexOf(
        searchString,
        nthLastIndexOf(string, searchString, n) - 1
      );
    }

    function getClosingTag(tagName) {
      return "</" + tagName + ">";
    }

    function getOpeningTag(tagName, attributes = {}) {
      var openingTag = "<" + tagName;
      for (const attribute in attributes) {
        openingTag =
          openingTag + " " + attribute + "='" + attributes[attribute] + "'";
      }
      openingTag = openingTag + ">";

      return openingTag;
    }

    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  },
  data() {
    return {
      widthClass: this.$q.screen.lt.sm ? "full-page" : "half-page",

      width: this.$q.screen.lt.sm ? window.innerWidth : window.innerWidth / 2,
      height: screen.height,
      loading: true,
      loadingText: "",
      lastScrollTop: 0,

      bookConfigs: {},

      fontSize: "font-size: 18px",

      singleTags: ["br", "hr"],

      frontCover: "",
      backCover: "",
      book: {
        title: "",
        front_matters: [],
        chapters: [],
        text: "",
        back_matters: [],
      },
      book2: {
        title: "Sherlock Holmes",
        front_matters: [],
        chapters: [],
        back_matters: [],
      },

      text: "",

      pages: [],
    };
  },

  methods: {
    loadPageFlip() {
      setTimeout(() => this.$refs.flipbook.updateFromHtml(), 1000);
    },

    configureCovers() {
      let frontCover = this.book.front_cover;
      let backCover = this.book.back_cover;
      let tempCover = this.book.temp_cover;

      //Setting up front cover url
      this.frontCover = frontCover != "" ? frontCover : tempCover;

      //Setting up back cover url
      this.backCover = backCover != "" ? backCover : tempCover;
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
      text = text.split("<br>").join("<br/>");
      text = text.split("<hr>").join("<hr/>");
      text = text.split("<img>").join("<img/>");

      return text;
    },

    turnToQueryPage() {
      let query = this.$route.query;
      if (
        query.hasOwnProperty("front_matter_id") &&
        front_matters in this.book
      ) {
        //For front matter query

        let front_matters = this.book.front_matters;
        let front_matter = front_matters.find(
          (o) => o.front_matter_id === query.front_matter_id
        );

        this.$refs.flipbook.flip(front_matter.pageNum);
      } else if (query.hasOwnProperty("chapter_id") && chapters in this.book) {
        //For chapter query
        let chapters = this.book.chapters;
        let chapter = chapters.find((o) => o.chapter_id === query.chapter_id);

        this.$refs.flipbook.flip(chapter.pageNum);
      } else if (
        query.hasOwnProperty("back_matter_id") &&
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
      console.log(this.book);
      if (Object.keys(this.$route.query) > 0) {
        this.turnToQueryPage();
      } else if (this.$q.localStorage.has("pageNum")) {
        let pageNum = this.$q.localStorage.getItem("pageNum");
        this.$refs.flipbook.flip(pageNum);
      }
    },

    onPageTurn(page) {
      this.$q.localStorage.set("pageNum", page);
    },

    //Attaching key bindings to turn pages in flipbook
    handleKeyPress(key) {
      //this if is to make lack of flipbook ref fail silently when route changes
      if (this.$refs.flipbook && !this.loading) {
        switch (key) {
          case "ArrowLeft":
            this.$refs.flipbook.flipPrev();
            break;
          case "ArrowRight":
            this.$refs.flipbook.flipNext();
            break;
          case "ArrowDown":
            this.$refs.flipbook.flipNext();
            break;
          case "ArrowUp":
            this.$refs.flipbook.flipPrev();
            break;
          case "VolumeUp":
            this.$refs.flipbook.flipNext();
            break;
          case "VolumeDown":
            this.$refs.flipbook.flipPrev();
            break;
          default:

          // code block
        }

        document.addEventListener(
          "keydown",
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
          "wheel",
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
      if (direction == "right") {
        this.$refs.flipbook.flipPrev();
      } else if (direction == "left") {
        this.$refs.flipbook.flipNext();
      } else if (direction == "top") {
        this.$emit("swiped", "top");
      } else if (direction == "down") {
        this.$emit("swiped", "down");
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
