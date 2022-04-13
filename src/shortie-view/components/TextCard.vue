<template>
  <div class="atropos-container" :class="classObject">
    <atropos
      :active-offset="40"
      :shadow="false"
      :shadow-scale="0"
      class="atropos-element"
      @enter="onEnter"
      @leave="onLeave"
      @rotate="onRotate"
    >
      <img src="svg/book_lover.svg" class="img" data-atropos-offset="-5" />

      <div class="card">
        <div class="card-header">{{ $props.header }}</div>
        <div class="card-contents">
          <slot></slot>
        </div>
      </div>
    </atropos>
  </div>
</template>

<script>
import { computed } from 'vue';
import Atropos from 'atropos/vue';

import 'atropos/css';

export default {
  components: {
    Atropos,
  },
  props: {
    currentState: {
      validator(value) {
        // The value must match one of these strings
        return ['notShown', 'showing', 'shown'].includes(value);
      },
    },
    text: {
      type: String,
      required: true,
    },
    header: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const onEnter = () => console.log('Enter');
    const onLeave = () => console.log('Leave');
    const onRotate = (x, y) => console.log('Rotate', x, y);

    const classObject = computed(() => {
      // 'atropos-container--not-shown': props['currentState'] == 'notShown',
      // 'atropos-container--shown': props['currentState'] == 'shown',
      return {
        'atropos-container--not-shown': props['currentState'] == 'notShown',
        'atropos-container--shown': props['currentState'] == 'shown',
      };
    });

    const next = () => {
      emit('nextClicked');
    };

    const prev = () => {
      emit('prevClicked');
    };

    return {
      onEnter,
      onLeave,
      onRotate,
      classObject,
      next,
      prev,
    };
  },
};
</script>

<style lang="scss" scoped>
.atropos-container {
  position: absolute;
  display: grid;
  place-items: center;
  min-height: 100vh;
  width: 100%;
  transform: translateY(0);
  transition-duration: 2s;

  &--not-shown {
    transform: translateY(1000px);
    transition-duration: 2s;
    transition-timing-function: ease-out;
  }

  &--shown {
    transform: translateY(-1000px);
    transition-duration: 1.75s;
    transition-timing-function: ease-in;
  }

  .atropos-element {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50px;
    position: relative;
  }

  img {
    position: absolute;
    left: -5%;
    top: -5%;
    width: 110%;
    height: 110%;
    object-fit: contain;
    display: block;
    z-index: -10;
    transform-style: preserve-3d;
    pointer-events: none;
    opacity: 0.7;
  }
}

.card {
  height: 500px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
  border: 1px solid;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  .card-header {
    height: 30px;
    font-size: 100%;
    text-transform: uppercase;
    text-align: center;
  }

  .card-contents {
    display: grid;
    //place-items: center;
    min-height: 100%;
    //width: 80%;
  }
}

// .card:before {
//   background-color: rgba(255, 255, 255, 0.3);
//   backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
//   content: '';
//   height: 100%;
//   position: absolute;
//   width: 100%;
// }
</style>
