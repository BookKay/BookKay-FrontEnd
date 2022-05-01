<template>
  <confirm-dialog
    :open="isOpen"
    :loading="isLoading"
    @confirmed="handleEmit"
    header="Hands Gesture Control"
    btnLabel="Activate"
    btnColor="positive"
  >
    <template #main-content class="main-content">
      <div class="image">
        <img src="reader/handsGesture.gif" alt="Hands Gesture in action" />
      </div>
      <div class="texts">
        <p>✋ - Turn Next Page</p>
        <p>✊ - Turn Prev Page</p>
        <p>
          This is an AI-powered tool that make use of the webcam to determine
          the gesture of your hand. All the processing occurs on your browser
          and the video is never sent to our server or anywhere. Thus, feel free
          to use the tool with full privacy 🔒.
        </p>
        <p>So, would you like to try our hands gesture control tool now?</p>
      </div>
    </template>
  </confirm-dialog>
</template>

<script lang="ts">
import ConfirmDialog from 'src/components/AppConfirmDialog.vue';
import useHandsFree from 'src/composables/useHandsFree';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HandsGestureDialog',
  components: { ConfirmDialog },
  setup() {
    const { toggleHandsFree } = useHandsFree();

    const isOpen = ref(false);
    const isLoading = ref(false);

    const toggleDialog = () => {
      console.log('in');
      isOpen.value = !isOpen.value;
    };

    const handleEmit = (isConfirmed: boolean) => {
      if (isConfirmed) {
        toggleHandsFree();
        isLoading.value = true;
        toggleDialog();
      } else {
        toggleDialog();
      }
    };

    return { isOpen, isLoading, toggleDialog, toggleHandsFree, handleEmit };
  },
});
</script>
<style lang="scss" scoped>
.image {
  display: flex;
  justify-content: center;
}

.image img {
  width: 500px;
}

.texts {
  margin-top: 20px;
}

@media (max-width: 500px) {
  .image img {
    width: 360px;
  }
}

@media (max-width: 400px) {
  .image img {
    width: 320px;
  }
}
</style>
