<template>
  <alert-dialog
    ref="alertDialog"
    @close="handleEmit"
    header="Considering Bookmarking..."
  >
    <template #main-content class="main-content">
      <transition-group
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <section v-if="currentPage == 'overall'">
          <div class="texts">
            <p>👋 Hi There</p>
            <p>
              You've been reading this book for <span>3 minutes</span> already.
            </p>
            <p>
              So, why not consider bookmarking this book so that you can come
              back and read this in the future? After all, long novels take time
              to read and feel it, so there is nothing going wrong about
              bookmarking this.
            </p>
          </div>
          <div>
            Choose your browser -
            <div>
              <div v-for="browser in browserBtns" :key="browser.label">
                <q-btn
                  :icon="browser.icon"
                  :label="browser.label"
                  @click="browser.onClick"
                />
              </div>
            </div>
          </div>
          <div>
            <q-checkbox
              :v-model="canShowBookmarkDialog"
              label="Reminds me to bookmark for each books"
            />
          </div>
        </section>
        <section v-else>
          <div v-for="browser in browserSteps" :key="browser.name">
            <div v-if="currentPage == browser.condition" class="browser-steps">
              <h2>{{ browser.name }}</h2>
              <div v-for="step in browser.steps" :key="step.index">
                <p>{{ `${step.index}. ` }}{{ step.text }}</p>
                <div class="browser-steps__image">
                  <img :alt="`Step - ${step.index}`" :src="step.img" />
                </div>
                <q-separator inset class="browser-steps__seperator" />
              </div>
            </div>
            <q-btn
              label="Back"
              icon="arrow_back"
              @click="currentPage = 'overall'"
            />
          </div>
        </section>
      </transition-group>
    </template>
  </alert-dialog>
</template>

<script lang="ts">
import AlertDialog from 'src/components/AppAlertDialog.vue';

import { defineComponent, ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'HandsGestureDialog',
  components: { AlertDialog },
  setup() {
    const alertDialog = ref<InstanceType<typeof AlertDialog>>();

    const toggleDialog = () => {
      alertDialog.value?.openDialog();
    };

    const handleEmit = () => {
      currentPage.value = 'overall';
    };

    const currentPage = ref('overall');

    const updateCurrentPage = () => {
      currentPage.value = 'chrome';
    };

    //To handle the do not auto open bookmark dialog button
    const $q = useQuasar();
    const canShowBookmarkDialogVal = $q.localStorage.has(
      'canShowBookmarkDialog'
    )
      ? $q.localStorage.getItem('canShowBookmarkDialog')
      : true;

    const canShowBookmarkDialog = ref(canShowBookmarkDialogVal);
    watch(canShowBookmarkDialog, (prevVal, currentVal) => {
      $q.localStorage.set('canShowBookmarkDialog', currentVal);
    });

    //Controls the contents of list of browsers in overall page
    const browserBtns = [
      {
        label: 'Chrome',
        icon: 'img:browsers/chrome.png',
        onClick: updateCurrentPage,
      },
      {
        label: 'Firefox',
        icon: 'img:browsers/firefox.png',
        onClick: (currentPage.value = 'firefox'),
      },
      {
        label: 'Microsoft Edge',
        icon: 'img:browsers/edge.png',
        onClick: (currentPage.value = 'edge'),
      },
      {
        label: 'Opera',
        icon: 'img:browsers/opera.png',
        onClick: (currentPage.value = 'opera'),
      },
      {
        label: 'Safari',
        icon: 'img:browsers/safari.png',
        onClick: (currentPage.value = 'safari'),
      },
      {
        label: 'Samsung Internet',
        icon: 'img:browsers/samsung_internet.png',
        onClick: (currentPage.value = 'samsung_internet'),
      },
    ];
    //Initialising it back to overall
    currentPage.value = 'overall';

    //Steps to bookmark for each browser
    const browserSteps = [
      {
        name: 'Chrome',
        condition: 'chrome',
        steps: [
          {
            index: 1,
            img: 'browsers/chrome_steps/step_1.png',
            text: 'Click on the star button on the right side of the search bar. (Or) Press ctrl + D',
          },
          {
            index: 2,
            img: 'browsers/chrome_steps/step_2.png',
            text: 'Rewrite the name into the title of the book. Choose the folder you would like to save in.',
          },
          {
            index: 3,
            img: 'browsers/chrome_steps/step_3.png',
            text: '(Optional) Make a new folder for BookKay links. Click on "New Folder" button and fill in BookKay. Then, press "Save" Button.',
          },
          {
            index: 4,
            img: 'browsers/chrome_steps/step_4.png',
            text: 'To open this bookmark back, click on the "Other Bookmarks" button on the right side underneath the search bar. There, hover over "BookKay folder" and open the link of the book back. Note: If you do not see this bar, pls click Ctrl + Shift + B',
          },
        ],
      },
    ];

    return {
      alertDialog,
      toggleDialog,
      handleEmit,
      currentPage,
      canShowBookmarkDialog,
      browserBtns,
      browserSteps,
    };
  },
});
</script>
<style lang="scss" scoped>
.browser-steps__image {
  display: flex;
  justify-content: center;
}

.browser-steps h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
  margin-top: 0;
}

.browser-steps p {
  margin-top: 10px;
}

.browser-steps__image img {
  width: 500px;
}

.browser-steps__seperator {
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (max-width: 500px) {
  .browser-steps__image img {
    width: 360px;
  }
}

@media (max-width: 400px) {
  .browser-steps__image img {
    width: 320px;
  }
}
</style>
