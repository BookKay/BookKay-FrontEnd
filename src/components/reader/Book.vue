<template>
  <div>
    <loading-screen v-if="loading" text="Page Loading...Please Wait" />
    <page
      :pageNum="1"
      header="title"
      text=""
      class="transparent"
      :class="widthClass"
      :fontSize="fontSize"
      v-if="loading"
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
      :disableFlipByClick="!$q.screen.lt.sm"
      ref="flipbook"
      v-if="!loading"
      id="flipbook"
      v-touch-swipe="handleSwipe"
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
    document.addEventListener(
      "keydown",
      e => {
        this.handleKeyPress(e.key);
      },
      { once: true }
    );

    document.addEventListener(
      "wheel",
      e => {
        this.handleScroll(e.deltaY);
      },
      { once: true }
    );
  },

  mounted() {
    const self = this;
    console.log(
      mapDOM(
        "<p style='text-indent: 10%;' width='400'>Hello <b>B<i>oy</i></b> </p>",
        true
      )
    );

    if (Object.keys(this.$route.query)[0] == "manuscript_id") {
      //loading the manuscript from server
      this.$api
        .get("manuscripts/" + this.$route.query.manuscript_id)
        .then(resp => {
          const manuscript = resp.data;

          this.$store.commit("write/setManuscript", manuscript);
          console.log("manuscript", manuscript);

          try {
            this.$q.sessionStorage.set("currentManuscript", manuscript);
          } catch (error) {
            console.log("err", error);
          }
          this.loadBook(manuscript);

          renderBook(this.book);

          this.loading = false;
        });
    }
    if (Object.keys(this.$route.query)[0] == "book_id") {
      //loading the book from server

      this.$api.get("books/" + this.$route.query.book_id).then(resp => {
        let book = resp.data;

        this.loadBook(book);

        renderBook(this.book);

        this.loading = false;
      });
    }

    function renderBook(book) {
      var pageNum = 1;
      var rootElement = "<div id='RootDivContainer'>";

      self.$emit("navAdded", {
        type: "book",
        label: book["title"],
        page: pageNum - 1,
        children: []
      });

      if (!self.$q.screen.lt.sm) {
        createPage(pageNum, book["title"], ""); // creates the first page
        pageNum++;
      }

      console.log("book", book);

      if ("front_matters" in book) {
        var front_matters = book["front_matters"];

        for (var i = 0; i < front_matters.length; i++) {
          self.$emit("navAdded", {
            type: "front_matter",
            label: front_matters[i]["title"],
            page: pageNum
          });

          //Based on config, adding title automatically
          var heading = " ";
          if (self.bookConfigs.auto_add_title) {
            heading = "<h2>" + front_matters[i]["title"] + "</h2>";
          }

          var text =
            rootElement + heading + front_matters[i]["text"] + "</div>";

          text = self.processClosingTag(text);
          text = self.addTabs(text);

          pageNum = paginateText(
            mapDOM(text, false),
            pageNum,
            front_matters[i]["title"]
          );

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, front_matters[i]["title"], page);
            document.getElementsByClassName("page-text")[0].innerHTML = "";
            pageNum++;
          }
        }
      }

      if (book.text != "") {
        self.$emit("navAdded", {
          type: "text",
          label: book["title"],
          page: pageNum
        });

        var text = rootElement + book["text"] + "</div>";
        text = self.processClosingTag(text);
        text = self.addTabs(text);

        pageNum = paginateText(mapDOM(text, false), pageNum, book["title"]);

        var page = document.getElementsByClassName("page-text")[0].innerHTML;
        if (page != "") {
          createPage(pageNum, book["title"], page);
          document.getElementsByClassName("page-text")[0].innerHTML = "";
          pageNum++;
        }
      }

      if ("chapters" in book) {
        var chapters = book["chapters"];

        for (var i = 0; i < chapters.length; i++) {
          self.$emit("navAdded", {
            type: "chapters",
            label: chapters[i]["title"],
            page: pageNum
          });

          //Based on config, adding title automatically
          var heading = " ";
          if (self.bookConfigs.auto_add_title) {
            heading = "<h2>" + chapters[i]["title"] + "</h2>";
          }

          var text = rootElement + heading + chapters[i]["text"] + "</div>";
          text = self.processClosingTag(text);
          text = self.addTabs(text);
          console.log("text", text);

          pageNum = paginateText(
            mapDOM(text, false),
            pageNum,
            chapters[i]["title"]
          );

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, chapters[i]["title"], page);
            document.getElementsByClassName("page-text")[0].innerHTML = "";
            pageNum++;
          }
        }
      }

      if ("back_matters" in book) {
        var back_matters = book["back_matters"];
        for (var i = 0; i < back_matters.length; i++) {
          self.$emit("navAdded", {
            type: "back_matter",
            label: back_matters[i]["title"],
            page: pageNum
          });

          //Based on config, adding title automatically
          var heading = " ";
          if (self.bookConfigs.auto_add_title) {
            heading = "<h2>" + back_matters[i]["title"] + "</h2>";
          }

          var text = rootElement + heading + back_matters[i]["text"] + "</div>";
          text = self.processClosingTag(text);
          text = self.addTabs(text);

          pageNum = paginateText(
            mapDOM(text, false),
            pageNum,
            back_matters[i]["title"]
          );

          var page = document.getElementsByClassName("page-text")[0].innerHTML;
          if (page != "") {
            createPage(pageNum, back_matters[i]["title"], page);
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
    }

    function mapDOM(element, json) {
      var treeObject = {};

      // If string convert to document Node
      if (typeof element === "string") {
        if (window.DOMParser) {
          var parser = new DOMParser();
          var docNode = parser.parseFromString(element, "text/xml");
        } else {
          // Microsoft strikes again
          var docNode = new ActiveXObject("Microsoft.XMLDOM");
          docNode.async = false;
          docNode.loadXML(element);
        }
        element = docNode.firstChild;
      }

      //Recursively loop through DOM elements and assign properties to object
      function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
          if (nodeList.length) {
            object["content"] = [];
            for (var i = 0; i < nodeList.length; i++) {
              if (nodeList[i].nodeType == 3) {
                object["content"].push(nodeList[i].nodeValue);
              } else {
                object["content"].push({});
                treeHTML(
                  nodeList[i],
                  object["content"][object["content"].length - 1]
                );
              }
            }
          }
        }
        if (element.attributes != null) {
          if (element.attributes.length) {
            object["attributes"] = {};
            for (var i = 0; i < element.attributes.length; i++) {
              object["attributes"][element.attributes[i].nodeName] =
                element.attributes[i].nodeValue;
            }
          }
        }
      }
      treeHTML(element, treeObject);

      return json ? JSON.stringify(treeObject) : treeObject;
    }

    function paginateText(DOM, pageNum, title, tags = []) {
      console.log("imp", tags, DOM);

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
          closingTag: closingTag
        });

        console.log(tags);
      }

      if (DOM["content"]) {
        for (var i = 0; i < DOM["content"].length; i++) {
          var content = DOM["content"][i];

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

                  var lastPage = self.pages[self.pages.length - 1].text.split(
                    " "
                  ); //text of last page

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
        text: text
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
        var lastOccurance = pageText.lastIndexOf(
          tags[tags.length - 1]["closingTag"]
        );
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
      lastScrollTop: 0,

      bookConfigs: {},

      fontSize: "font-size: 18px",

      singleTags: ["br", "hr"],

      frontCover: "cover/cover.jpg",
      backCover: "cover/cover-2.jpg",
      book: {
        title: "",
        front_matters: [],
        chapters: [],
        text: "",
        back_matters: []
      },
      book2: {
        title: "Sherlock Holmes",
        front_matters: [],
        chapters: [],
        back_matters: []
      },

      text: "",

      pages: []
    };
  },

  methods: {
    loadBook(book) {
      //the parameter book here stands for both the book and manuscript
      //it is the json obj sent back from backend
      console.log(book);

      //Copying the configs
      this.bookConfigs = book.configs;

      //Setting up cover variables
      let tempCover = book.temp_cover;

      let frontCover = book.front_cover;

      var backCover = book.back_cover;

      //Setting up front cover url
      this.frontCover = this.processCoverUrls(frontCover, tempCover);

      //Setting up back cover url

      this.backCover = this.processCoverUrls(backCover, tempCover);

      //Configuring the book object based on the data from server

      //Setting up title
      this.book.title = book.title;

      //Setting up front matters
      if (book.configs.contain_front_matter && book.front_matters.length > 0) {
        var frontMatters = book.front_matters.sort(this.compareIndex);

        for (var i = 0; i < frontMatters.length; i++) {
          const frontMatter = frontMatters[i];
          this.book.front_matters.push({
            title: frontMatter.title,
            text: frontMatter.text
          });
        }
      }

      //Setting up chapters
      if (book.configs.contain_chapter && book.chapters.length > 0) {
        var chapters = book.chapters.sort(this.compareIndex);

        for (var i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          this.book.chapters.push({
            title: chapter.title,
            text: chapter.text
          });
        }
      } else {
        //Setting up the text if no chapters are present
        var text = book.text;

        this.book.text = text;
      }

      //Setting up back matters
      if (book.configs.contain_back_matter && book.back_matters.length > 0) {
        var backMatters = book.back_matters.sort(this.compareIndex);

        for (var i = 0; i < backMatters.length; i++) {
          const backMatter = backMatters[i];
          this.book.back_matters.push({
            title: backMatter.title,
            text: backMatter.text
          });
        }
      }
      console.log("output", this.book);
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

    processCoverUrls(cover, alternative) {
      //Configuring url
      let url = cover ? cover : alternative;

      let parts = url.split("/");

      //Adding in the transformation url
      parts.splice(
        6,
        0,
        `w_${this.width},h_${this.height},c_scale,b_rgb:F5F5DC,q_auto`
      );

      url = parts.join("/");

      return url;
    },

    processClosingTag(text) {
      //To standardize self closing tags
      text = text.split("<br>").join("<br/>");
      text = text.split("<hr>").join("<hr/>");
      text = text.split("<img>").join("<img/>");

      return text;
    },
    addTabs(text) {
      return text.replaceAll("&nbsp;", '<span class="tab"></span>');
    },

    handleKeyPress(key) {
      //this if is to make lack of flipbook ref fail silently when route changes
      if (this.$refs.flipbook) {
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
          default:

          // code block
        }

        document.addEventListener(
          "keydown",
          e => {
            this.handleKeyPress(e.key);
          },
          { once: true }
        );
      }
    },
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
          e => {
            this.handleScroll(e.deltaY);
          },
          { once: true }
        );
      }
    },
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
    }
  }
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
