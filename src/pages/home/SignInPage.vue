<template>
  <q-form
    class="q-ma-lg sign-in-form"
    @submit.prevent.stop="onSubmit"
    @reset.prevent.stop="onReset"
  >
    <h2 class="title">Sign in</h2>

    <q-input
      v-model="user.email"
      ref="email"
      type="email"
      label="Email"
      class="q-ma-md"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type your email',
        (val) => val.length <= 100 || 'Email must be smaller than 100',
        (val) => val.indexOf('@') != -1 || 'Please type a real email',
      ]"
      @keydown.enter.prevent="$refs.password.focus()"
    >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-input
      ref="password"
      label="Password"
      class="q-ma-md"
      v-model="user.password"
      :type="showPwd ? 'text' : 'password'"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type your password',
        (val) => val.length <= 100 || 'Password must not exceeds 100',
        (val) => val.length > 8 || 'Password must exceeds 8',
      ]"
      @keydown.enter.prevent="onSubmit"
    >
      <template v-slot:prepend>
        <q-icon name="fas fa-lock" />
      </template>
      <template #append>
        <q-icon
          :name="showPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showPwd = !showPwd"
        />
      </template>
    </q-input>
    <q-btn
      label="Login"
      type="submit"
      :ripple="{ early: true }"
      class="btn solid"
      @click="onSubmit"
    />
    <!-- <p class="social-text">Or Sign in with social platforms</p>
          <div class="social-media">
            <a href="#" class="social-icon">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-google"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div> -->
  </q-form>
</template>

<script>
export default {
  name: "SignInPage",
  data() {
    return {
      showPwd: false,
      user: { email: "", password: "" },
    };
  },
  computed: {
    authStatus() {
      return this.$store.getters["user/authStatus"];
    },
  },
  beforeMount() {
    if (this.$store.getters["user/isLoggedIn"]) {
      this.$router.push({
        name: "app-read",
      });
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.email.validate();
      this.$refs.password.validate();

      if (this.$refs.email.hasError || this.$refs.password.hasError) {
        this.formHasError = true;
      } else {
        try {
          await this.$store.dispatch("user/register", this.user);
          this.$q.notify({
            icon: "done",
            color: "positive",
            message: "Welcome!!!",
          });
          this.$router.replace({ name: "app-read" });
        } catch (error) {
          let string = error.response.data.email[0];
          let msg = string.charAt(0).toUpperCase() + string.slice(1);

          this.$q.notify({
            color: "negative",
            position: "top",
            message: msg || "Something went wrong",
            icon: "error",
            actions: [
              {
                label: "Login Instead?",
                color: "white",
                handler: () => {
                  this.$router.push({ name: "home-sign-in" });
                },
              },
            ],
          });
        }
      }
    },

    onReset() {
      this.email = null;
      this.password = null;

      this.$refs.email.resetValidation();
      this.$refs.password.resetValidation();
    },
  },
};
</script>
