<template>
  <div class="stand-out-card">
    <div class="inner-book row">
      <div class="q-ma-md main-text col">
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
        <!--</div>
      <div class="absolute-bottom">-->
        <div>
          <p class="description ellipsis-3-lines">{{ book.description }}</p>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            {{ book.description }}
          </q-tooltip>
        </div>
      </div>

      <div class="col">
        <img class="front-cover" :src="book.front_cover" />
      </div>
    </div>
    <q-btn
      :label="btnLabel"
      color="black"
      class="read-btn row"
      :ripple="{ early: true }"
      @click="$emit('btnClicked', book)"
    />
  </div>
</template>

<script>
export default {
  components: {},
  name: "StandOutCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
    btnLabel: {
      type: String,
      required: true,
    },
  },
  setup(props) {},
};
</script>
<style lang="scss" scoped>
.stand-out-card {
  border-radius: 20px;
  background-color: #dcdcdc;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  width: 50vw;
  max-height: 40vh;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.inner-book {
  //height: 40vh;
  position: relative;
}

.front-cover {
  position: relative;
  top: -30px;
  right: 15px;
  float: right;
  background-size: contain;
  background-repeat: no-repeat;
  height: 27vh;
  width: 170px;
  border-radius: 15px;
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.main-text {
  position: absolute;
  top: 10px;
  left: 20px;
}

.title {
  font-weight: 700;
  font-size: 20px;
  overflow: hidden;
  max-height: 60px;
  width: 30vw;
  padding: 0;
  margin: 0;
}

.author-name {
  font-size: 18px;
  font-weight: 300;
  padding: 0;
  margin: 0;
  margin-top: 10px;
}

.description {
  margin-top: 20px;
  font-size: 12px;
  overflow: hidden;
  height: 50px;
  width: 360px;
}

.read-btn {
  position: relative;
  float: right;
  border-radius: 15px 0 10px 0;
  width: 250px;
}

@media (max-width: 768px) {
  .stand-out-card {
    width: 90vw;
    margin-top: 0;
  }

  .front-cover {
    width: 150px;
    height: 170px;
  }

  .main-text {
    left: 5px;
  }

  .title {
    width: 500px;
    height: 30px;
  }

  .description {
    font-size: 16px;
    height: 70px;
    width: 450px;
  }
}

@media (max-width: 480px) {
  .stand-out-card {
    width: 90vw;
    margin-top: 20px;
  }

  .front-cover {
    right: 10px;
    height: 120px;
    width: 100px;
  }

  .main-text {
    left: 5px;
  }

  .title {
    font-size: 16px;
    width: 180px;
    height: 25px;
  }

  .author-name {
    font-size: 12px;
    margin-top: 0;
  }

  .description {
    font-size: 12px;
    width: 150px;
    height: 50px;
  }

  .read-btn {
    width: 140px;
  }
}

@media (max-width: 350px) {
  .title {
    width: 150px;
  }

  .description {
    width: 150px;
  }

  .read-btn {
    width: 100px;
  }
}
</style>
