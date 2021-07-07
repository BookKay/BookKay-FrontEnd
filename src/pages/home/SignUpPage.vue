<template>
  <q-page class="flex flex-center">
    <q-card class="q-my-md">
      <h2 class="q-ma-lg">Come Join Us!</h2>

      <q-separator inset />

      <q-form
        class="q-ma-lg"
        @submit.prevent.stop="onSubmit"
        @reset.prevent.stop="onReset"
      >
        <q-input
          v-model="user.username"
          ref="username"
          filled
          label="Username"
          class="q-ma-md"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Please type your username',
            val => val.length <= 100 || 'Username must not be greater than 100'
          ]"
          @keydown.enter.prevent="$refs.email.focus()"
        />
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
          @keydown.enter.prevent="$refs.password2.focus()"
        >
          <template v-slot:append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-input
          v-model="password2"
          filled
          ref="password2"
          :type="showPwd ? 'text' : 'password'"
          label="Reenter Password"
          class="q-ma-md"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Please type your password',
            val => val.length <= 100 || 'Must no exceed 100',
            val => val.length > 8 || 'Password must exceeds 8',
            val => val == this.$refs.password.value || 'Not same passwords'
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn label="Register" type="submit" color="primary" class="q-ma-md">
          <q-spinner-hourglass
            v-if="authStatus == 'loading'"
            color="white"
            size="1.2em"
          />
        </q-btn>
      </q-form>
      <q-btn
        label="Already one of us? Login now!"
        type="submit"
        color="primary"
        flat
        class="q-mx-md q-my-lg"
        :to="{ name: 'home-sign-in' }"
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
      password2: "",
      user: {
        username: "",
        email: "",
        password: ""
      },
      loading: false
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
      this.$refs.username.validate();
      this.$refs.email.validate();
      this.$refs.password.validate();
      this.$refs.password2.validate();

      if (
        this.$refs.username.hasError ||
        this.$refs.email.hasError ||
        this.$refs.password.hasError ||
        this.$refs.password2.hasError
      ) {
        this.formHasError = true;
      } else {
        this.loading = true;
        this.$store
          .dispatch("user/register", this.user /*, { root: true }*/)
          .then(data => {
            this.loading = false;
            this.$q.notify({
              icon: "done",
              color: "positive",
              message: "Welcome!!!"
            });
            this.$router.replace({ name: "app-read" });
          })
          .catch(error => {
            this.loading = false;
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error",
              actions: [
                {
                  label: "Login Instead?",
                  color: "white",
                  handler: () => {
                    this.$router.push({ name: "home-sign-in" });
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
