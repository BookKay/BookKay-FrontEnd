<template>
  <div class="loader-wrapper">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="loading-text-container" :key="text">
        <div class="loading-text" :class="loadingTextClasses">
          <h3>
            {{ text }}
          </h3>
          <div>
            <div class="clock-loader" :class="clockLoaderClasses"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { watch, reactive } from "vue";

export default {
  name: "LoadingScreen",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $q = useQuasar();

    const loadingTextClasses = reactive({
      "loading-text--dark": $q.dark.isActive,
    });

    const clockLoaderClasses = reactive({
      "clock-loader--dark": $q.dark.isActive,
    });

    watch(
      () => $q.dark.isActive,
      (val) => {
        if (val) {
          loadingTextClasses["loading-text--dark"] = true;
          clockLoaderClasses["clock-loader--dark"] = true;
        } else {
          loadingTextClasses["loading-text--dark"] = false;
          clockLoaderClasses["clock-loader--dark"] = false;
        }
      }
    );

    return { loadingTextClasses, clockLoaderClasses };
  },
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  width: 100vw;
  height: 100vh;
  background: transparent;
}

.loading-text-container {
  position: fixed;
  bottom: 0;
  margin-bottom: 80px;
  width: 100%;
  z-index: 10;
}

.loading-text {
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  h3 {
    margin-bottom: 20px;
  }

  &--dark {
    color: #fff;
  }
}

@media (max-width: 780px) {
  .loading-text-container {
    top: 50%;
    transform: translate(0, -50%);
    bottom: auto;
  }
}

@media (max-width: 480px) {
  .loading-text h3 {
    font-size: 2rem;
  }
}
</style>
<style lang="scss" scoped>
.clock-loader {
  --clock-color: black;
  --clock-width: 4rem;
  --clock-radius: calc(var(--clock-width) / 2);
  --clock-minute-length: calc(var(--clock-width) * 0.4);
  --clock-hour-length: calc(var(--clock-width) * 0.2);
  --clock-thickness: 0.2rem;

  position: relative;
  display: inline-flex;
  //display: flex;
  justify-content: center;
  align-items: center;
  width: var(--clock-width);
  height: var(--clock-width);
  border: 3px solid var(--clock-color);
  border-radius: 50%;

  &::before,
  &::after {
    position: absolute;
    content: "";
    top: calc(var(--clock-radius) * 0.25);
    width: var(--clock-thickness);
    background: var(--clock-color);
    border-radius: 10px;
    transform-origin: center calc(100% - calc(var(--clock-thickness) / 2));
    animation: spin infinite linear;
  }

  &::before {
    height: var(--clock-minute-length);
    animation-duration: 2s;
  }

  &::after {
    top: calc(var(--clock-radius) * 0.25 + var(--clock-hour-length));
    height: var(--clock-hour-length);
    animation-duration: 15s;
  }
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

//Dark Mode
.clock-loader {
  --clock-color: white;

  border-color: var(--clock-color);

  &::before,
  &::after {
    background-color: var(--clock-color);
  }
}
</style>
