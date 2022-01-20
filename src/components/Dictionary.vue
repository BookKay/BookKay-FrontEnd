<template>
  <app-prompt-dialog
    :open="searchDialog"
    label="Dictionary"
    caption="Word To Search"
    value=""
    @confirmed="search"
  />

  <q-dialog v-model="resultDialog">
    <q-card
      class="result-card"
      v-bind:class="{
        active: this.$q.dark.isActive,
        'result-word--dark': this.$q.dark.isActive,
      }"
    >
      <q-card-section
        class="result-word"
        v-bind:class="{
          active: this.$q.dark.isActive,
          'result-word--dark': this.$q.dark.isActive,
        }"
      >
        <h3>{{ capitalizeFirstLetter(searchWord) }}</h3>
      </q-card-section>

      <q-card-section>
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="0"
          :centeredSlides="false"
          :navigation="true"
          :pagination="{ clickable: true }"
          :keyboard="{
            enabled: true,
          }"
          :simulateTouch="true"
        >
          <swiper-slide v-for="(entry, index) in result" :key="index">
            <div class="result-container">
              <div class="result">
                <div
                  class="result-definition"
                  v-bind:class="{
                    active: this.$q.dark.isActive,
                    'result-word--dark': this.$q.dark.isActive,
                  }"
                >
                  ({{ entry.pos }})
                  {{ capitalizeFirstLetter(entry.definition) }}
                </div>
                <div class="result-examples" v-if="entry.examples.length > 0">
                  <h4>Examples</h4>
                  <p v-for="(example, index) in entry.examples" :key="index">
                    {{ example }}
                  </p>
                </div>
                <div class="result-synonyms" v-if="entry.synonyms.length > 0">
                  <h4>
                    <span>Synonyms:</span> {{ entry.synonyms.join(', ') }}
                  </h4>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline :ripple="{ early: true }" label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import AppPromptDialog from 'src/components/AppPromptDialog.vue';

import { Navigation, Pagination, Keyboard, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/keyboard';

export default {
  name: 'Dictionary',
  components: { AppPromptDialog, Swiper, SwiperSlide },
  data() {
    return {
      searchDialog: false,
      resultDialog: false,
      searchWord: '',
      result: [],
      modules: [Navigation, Pagination, Keyboard, A11y],
      cardClasses: {
        'result-word--dark': this.$q.dark.isActive,
      },
    };
  },
  watch: {
    'this.$q.dark.isActive': function (val) {
      this.cardClasses['result-word--dark'] = val;
    },
  },
  methods: {
    openSearchDialog() {
      this.searchDialog = !this.searchDialog;
    },

    async search(word) {
      this.searchDialog = false;
      if (word) {
        this.searchWord = word;
        let response = await this.$api.post('users/dictionary', {
          word: word,
        });

        this.result = response.data.result;

        this.resultDialog = true;
      }
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.result-card {
  min-width: 450px;
  //background-color: rgba(183, 226, 225);
}

.result-container {
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.result-word {
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  padding: 0;
  margin-top: 10px;
  color: #0d6e5f;
  font-weight: 700;
}

.result-definition {
  font-size: 20px;
  color: #004036;
  margin-bottom: 20px;
}

.result-word--dark {
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  padding: 0;
  margin-top: 10px;
  color: white;
  font-weight: 700;
}

.result-examples {
  margin-bottom: 10px;

  h4 {
    font-size: 20px;
    margin-bottom: 10px;
    line-height: 1.5em;
    font-weight: 700;
  }

  p {
    font-size: 18px;
    margin-bottom: 8px;
  }
}

.result-synonyms h4 {
  font-size: 20px;
  margin-bottom: 15px;
  line-height: 1.5em;

  span {
    font-weight: 700;
  }
}

@media (max-width: 330px) {
  .result-card {
    min-width: 300px;
  }
}
</style>
