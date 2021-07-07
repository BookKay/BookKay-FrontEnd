<template>
  <q-page class="flex flex-center">
    <q-card>
      <h2 class="q-ma-lg">Welcome Back!!!</h2>

      <q-separator inset />

      <q-form
        class="q-ma-lg"
        @submit.prevent.stop="onSubmit"
        @reset.prevent.stop="onReset"
      >
        <q-input
          v-model="user.email"
          ref="email"
          filled
          type="email"
          label="Email"
          class="q-ma-md"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Please type your email',
            val => val.length <= 100 || 'Email must be smaller than 100',
            val => val.indexOf('@') != -1 || 'Please type a real email'
          ]"
          @keydown.enter.prevent="$refs.password.focus()"
        />
        <q-input
          v-model="user.password"
          filled
          ref="password"
          :type="showPwd ? 'text' : 'password'"
          label="Password"
          class="q-ma-md"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Please type your password',
            val => val.length <= 100 || 'Password must not exceeds 100',
            val => val.length > 8 || 'Password must exceeds 8'
          ]"
        >
          <template #append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn label="Login" type="submit" color="primary" class="q-ma-md">
          <q-spinner-hourglass
            v-if="authStatus == 'loading'"
            color="white"
            size="1.2em"
          />
        </q-btn>
      </q-form>
      <q-btn
        label="Not one of us yet? Register now!"
        type="submit"
        color="primary"
        flat
        class="q-mx-md q-my-lg"
        :to="{ name: 'home-sign-up' }"
      />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "SignInPage",
  data() {
    return {
      showPwd: false,
      user: { email: "", password: "" }
    };
  },
  computed: {
    authStatus() {
      return this.$store.getters["user/authStatus"];
    }
  },
  beforeMount() {
    if (this.$store.getters["user/isLoggedIn"]) {
      this.$router.push({
        name: "app-read"
      });
    }
  },
  methods: {
    onSubmit() {
      this.$refs.email.validate();
      this.$refs.password.validate();

      if (this.$refs.email.hasError || this.$refs.password.hasError) {
        this.formHasError = true;
      } else {
        this.$store
          .dispatch("user/login", this.user /*, { root: true }*/)
          .then(data => {
            this.$q.notify({
              icon: "done",
              color: "positive",
              message: "Welcome Back"
            });
            if (this.$route.query == {}) {
              this.$router.replace({ path: this.$route.query.redirect });
            } else {
              this.$router.replace({ name: "app-read" });
            }
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error",
              actions: [
                {
                  label: "Register Instead?",
                  color: "white",
                  handler: () => {
                    this.$router.push({ name: "home-sign-up" });
                  }
                }
              ]
            });
          });
      }
    },

    onReset() {
      this.email = null;
      this.password = null;

      this.$refs.email.resetValidation();
      this.$refs.password.resetValidation();
    }
  }
};
</script>
