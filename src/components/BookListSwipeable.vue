<template>
  <swiper
    :modules="modules"
    :slides-per-view="slidesCount"
    :space-between="50"
    :centeredSlides="true"
    :navigation="!$q.screen.lt.md"
    :pagination="{ clickable: true }"
    :keyboard="{
      enabled: true,
    }"
    :simulateTouch="enablesTouch"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide v-for="book in books" :key="book.id"
      ><div class="book-card">
        <div class="inner-book row">
          <img class="front-cover col" :src="book.front_cover" />

          <div class="main-text col">
            <div>
              <p class="title">{{ book.title }}</p>
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                {{ book.title }}
              </q-tooltip>
            </div>
            <p class="author-name">{{ book.author_name }}</p>
          </div>
        </div>

        <div class="row">
          <q-btn
            flat
            :label="secondaryLabel"
            color="black"
            class="secondary-btn"
            @click="$emit('secondaryClicked', book)"
          />
          <q-btn
            :label="primaryLabel"
            color="black"
            class="primary-btn"
            @click="$emit('primaryClicked', book)"
          />
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { useQuasar } from "quasar";
import { computed } from "vue";

import { Navigation, Pagination, Keyboard, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  name: "SimpleBookList",
  props: {
    books: {
      type: Array,
      required: true,
    },
    primaryLabel: {
      type: String,
      required: true,
    },
    secondaryLabel: {
      type: String,
      required: true,
    },
  },

  methods: {},
  setup(props) {
    const onSwiper = (swiper) => {};
    const onSlideChange = () => {};

    const $q = useQuasar();
    const slidesCount = computed(() => {
      let slidesNum;

      if ($q.screen.lt.md) {
        if ($q.screen.lt.sm) {
          slidesNum = 1.5;
        } else {
          slidesNum = 3;
        }
      } else {
        slidesNum = 4;
      }

      return slidesNum;
    });

    return {
      onSwiper,
      onSlideChange,
      slidesCount,
      modules: [Navigation, Pagination, Keyboard, A11y],
    };
  },
};
</script>
<style lang="scss" scoped>
.book-card {
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-radius: 10px;
  margin: 40px 0;

  //min-height: 30vh;
}

// .inner-book {
//   height: 30vh;
// }

.primary-btn {
  border-radius: 15px 0 10px 0;
  width: 50%;
}

.secondary-btn {
  border-radius: 0 10px;
  width: 50%;
}

.front-cover {
  max-width: 150px;
  max-height: 150px;
  position: relative;
  top: -30px;
  left: 6px;
  z-index: 1;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.main-text {
  margin: 16px;
}

.title {
  font-weight: 700;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60px;
  padding: 0;
  margin: 0;
}

.author-name {
  font-size: 16px;
  color: grey;
  font-weight: 300;
  padding: 0;
  margin: 0;
  margin-top: 10px;
}

@media (max-width: 480px) {
  .front-cover {
    max-width: 50%;
    max-height: 70%;
  }

  .title {
    font-size: 16px;
    width: 30vw;
    height: 50px;
  }

  .main-text {
    left: 160px;
  }
}
</style>
