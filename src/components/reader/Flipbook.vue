<template>
  <div ref="parentElement" class="flipbook">
    <slot></slot>
  </div>
</template>

<script>
import { PageFlip } from "page-flip";

export default {
  name: "Flipbook",
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    size: {
      validator: function(value) {
        // The value must match one of these strings
        return ["fixed", "stretch"].indexOf(value) !== -1;
      }
    },
    minWidth: {
      type: Number,
      required: false
    },
    maxWidth: {
      type: Number,
      required: false
    },
    minHeight: {
      type: Number,
      required: false
    },
    maxHeight: {
      type: Number,
      required: false
    },
    drawShadow: {
      type: Boolean,
      default: true
    },
    flippingTime: {
      type: Number,
      default: 1000
    },
    usePortrait: {
      type: Boolean,
      default: true
    },
    startZIndex: {
      type: Number,
      default: 0
    },
    startPage: {
      type: Number,
      default: 0
    },
    autoSize: {
      type: Boolean,
      default: true
    },
    maxShadowOpacity: {
      type: Number,
      default: 1,
      validator: function(value) {
        // The value must match one of these strings
        return value >= 0 && value <= 1;
      }
    },
    showCover: {
      type: Boolean,
      default: false
    },
    mobileScrollSupport: {
      type: Boolean,
      default: true
    },
    swipeDistance: {
      type: Number,
      default: 30
    },
    clickEventForward: {
      type: Boolean,
      default: true
    },
    useMouseEvents: {
      type: Boolean,
      default: true
    },
    disableFlipByClick: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.createFlipbook();
  },
  data() {
    return {
      pageFlip: ""
    };
  },
  methods: {
    createFlipbook() {
      const parent = this.$refs.parentElement;
      const settings = {
        width: this.$props.width,
        height: this.$props.height,
        size: this.$props.size,
        minWidth: this.$props.minWidth,
        maxWidth: this.$props.maxWidth,
        minHeight: this.$props.minHeight,
        maxHeight: this.$props.maxHeight,
        drawShadow: this.$props.drawShadow,
        flippingTime: this.$props.flippingTime,
        usePortrait: this.$props.usePortrait,
        startZIndex: this.$props.startZIndex,
        startPage: this.$props.startPage,
        autoSize: this.$props.autoSize,
        maxShadowOpacity: this.$props.maxShadowOpacity,
        showCover: this.$props.showCover,
        mobileScrollSupport: this.$props.mobileScrollSupport,
        swipeDistance: this.$props.swipeDistance,
        clickEventForward: this.$props.clickEventForward,
        useMouseEvents: this.$props.useMouseEvents,
        disableFlipByClick: this.$props.disableFlipByClick
      };

      const pageFlip = new PageFlip(parent, settings);
      if (!pageFlip.getFlipController()) {
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));
      } else {
        pageFlip.updateFromHtml(document.querySelectorAll(".page"));
      }

      this.pageFlip = pageFlip;
    },

    getPageCount() {
      this.pageFlip.getPageCount();
    },

    flip(pageNum, corner = "") {
      if ((corner = "")) {
        corner = this.getCorner();
      }
      this.pageFlip.flip(pageNum, corner);
    },

    flipNext(corner = "") {
      if (!corner) {
        corner = this.getCorner();
      }
      console.log(this.pageFlip.getOrientation());

      this.pageFlip.flipNext(corner);
    },

    flipPrev(corner = "") {
      if (!corner) {
        corner = this.getCorner();
      }

      this.pageFlip.flipPrev(corner);
    },

    destroy() {
      this.pageFlip.destroy();
    },

    getCorner() {
      var corners = ["top", "bottom"];
      var randomCorner = corners[Math.floor(Math.random() * corners.length)];

      return randomCorner;
    }
  }
};
</script>

<style lang="scss" scoped>
.flip-book {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
  display: none;
  background-size: cover;
}
</style>
