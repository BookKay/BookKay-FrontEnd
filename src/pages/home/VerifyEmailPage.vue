<template>
  <div class="fullscreen text-center flex flex-center">
    <div v-if="is_loading">
      <img src="svg/loading.svg" alt="Loading" class="img" />

      <div class="text" style="opacity: 0.4">Loading</div>
    </div>
    <div v-else-if="is_verfied">
      <img src="svg/welcome.svg" alt="Verified" class="img" />

      <div class="text" style="opacity: 0.4">Yay, Email Verified</div>

      <q-btn
        class="q-mt-lg"
        color="white"
        text-color="blue"
        rounded
        outline
        :to="{ name: 'app-read' }"
        :ripple="{ early: true }"
        label="Go To App"
        no-caps
      />
    </div>
    <div v-else>
      <img src="svg/page_not_found.svg" alt="Page Not Found" class="img" />

      <div class="text" style="opacity: 0.4">Sorry, Invalid Token</div>

      <q-btn
        class="q-mt-lg"
        color="white"
        text-color="blue"
        rounded
        outline
        :ripple="{ early: true }"
        label="Resend verification email"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Error404",
  data() {
    return {
      is_loading: false,
      is_verified: false,
    };
  },
  async mounted() {
    let id = this.$route.query["id"];
    let token = this.$route.query["token"];

    if (token) {
      let response = await this.$api.post(`users/${id}/verify_email`, {
        token: token,
      });
      this.is_verified = response.status == 200 ? true : false;
    } else {
      this.is_verified = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.img {
  width: 40vw;
  height: 30vw;
}

.text {
  font-size: 60px;
  line-height: 80px;
}

@media (max-width: 780px) {
  .img {
    width: 50vw;
    height: 50vw;
  }
}

@media (max-width: 480px) {
  .img {
    width: 80vw;
    height: 80vw;
  }

  .text {
    font-size: 30px;
  }
}
</style>
