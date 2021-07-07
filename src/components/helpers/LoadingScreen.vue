<template>
  <transition
    appear
    enter-active-class="animated slideInDown"
    leave-active-class="animated slideOutUp"
  >
    <div class="loader-wrapper">
      <div class="pencil">
        <div class="pencil__ball-point"></div>
        <div class="pencil__cap"></div>
        <div class="pencil__cap-base"></div>
        <div class="pencil__middle"></div>
        <div class="pencil__eraser"></div>
      </div>
      <div class="line"></div>
      <h2 class="text-primary">{{ text }}</h2>
    </div>
  </transition>
</template>

<script>
export default {
  name: "LoadingScreen",
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
$pencil-color: #09d56e;
$pencil-dark: #232123;

.loader-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fbf0d9;
}

.pencil {
  @keyframes pencil-animation {
    0% {
      transform: rotate(135deg);
    }

    20% {
      transform: rotate(315deg);
    }

    45% {
      transform: translateX(300px) rotate(315deg);
    }

    55% {
      transform: translateX(300px) rotate(495deg);
    }

    100% {
      transform: rotate(495deg);
    }
  }

  position: relative;
  width: 300px;
  height: 40px;
  transform-origin: center;
  transform: rotate(135deg);
  animation: pencil-animation 10s infinite;

  &__ball-point {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: $pencil-color;
    height: 10px;
    width: 10px;
    border-radius: 50px;
  }

  &__cap {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    clip-path: polygon(20% 40%, 100% 0%, 100% 100%, 20% 60%);
    background: $pencil-dark;
    width: 12%;
    height: 100%;
  }

  &__cap-base {
    position: absolute;
    left: 12%;
    top: 0;
    height: 100%;
    width: 20px;
    background: $pencil-dark;
  }

  &__middle {
    position: absolute;
    left: calc(12% + 20px);
    top: 0;
    height: 100%;
    width: 70%;
    background: $pencil-color;
  }

  &__eraser {
    position: absolute;
    left: calc(12% + 70% + 20px);
    top: 0;
    height: 100%;
    width: 11%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background: $pencil-color;
  }
}

.line {
  @keyframes line-animation {
    20% {
      transform: scaleX(0);
    }

    45% {
      transform: scaleX(0.6);
    }

    55% {
      transform: scaleX(0.6);
    }

    100% {
      transform: scaleX(0);
    }
  }

  position: relative;
  top: 80px;
  right: 103px;
  height: 10px;
  width: 1000px;

  border-radius: 50px;
  background: $pencil-color;
  transform: scaleX(0);
  transform-origin: center;
  animation: line-animation 10s infinite;
}

h2 {
  position: relative;
  top: 150px;
  right: 75px;
}
</style>
