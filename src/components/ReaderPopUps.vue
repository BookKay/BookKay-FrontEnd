<template>
  <hands-gesture-dialog ref="handsGestureDialog" />
  <reader-bookmark-dialog ref="bookmarkDialog" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

import HandsGestureDialog from 'src/components/HandsGestureDialog.vue';
import ReaderBookmarkDialog from 'src/components/ReaderBookmarkDialog.vue';

export default defineComponent({
  components: { HandsGestureDialog, ReaderBookmarkDialog },
  setup() {
    const $q = useQuasar();
    const route = useRoute();

    const handsGestureDialog = ref<InstanceType<typeof HandsGestureDialog>>();
    const toggleHandsGestureDialog = () => {
      handsGestureDialog.value?.toggleDialog();
    };

    onMounted(() => {
      setTimeout(() => {
        if (!$q.localStorage.has('handsGestureDialogShown')) {
          toggleHandsGestureDialog();
          $q.localStorage.set('handsGestureDialogShown', true);
        }
      }, 20000);
    });

    const bookmarkDialog = ref<InstanceType<typeof ReaderBookmarkDialog>>();
    const toggleBookmarkDialog = () => {
      bookmarkDialog.value?.toggleDialog();
    };
    const injectBookmarkDialog = () => {
      if ('book_id' in route.query) {
        const id = route.query['book_id'];

        let canShow = false;
        if (!$q.localStorage.has('canShowBookmarkDialog')) {
          $q.localStorage.set('canShowBookmarkDialog', true);
          canShow = true;
        } else {
          canShow = $q.localStorage.getItem('canShowBookmarkDialog') as boolean;
        }

        if (canShow && !$q.localStorage.has(`bookmarkDialogShown_${id}`)) {
          toggleBookmarkDialog();
          $q.localStorage.set(`bookmarkDialogShown_${id}`, true);
        }
      }
    };

    onMounted(() => {
      setTimeout(() => {
        injectBookmarkDialog();
      }, 10000);
    });

    return { handsGestureDialog };
  },
});
</script>
