<template>
  <q-page class="flex flex-center">
    <q-stepper v-model="step" ref="stepper" color="primary" header-nav animated>
      <q-step
        :name="1"
        title="Current Password"
        icon="settings"
        :error="!correct_password"
        :done="step > 1"
      >
        Please enter your current password.
        <q-input
          v-model="old_password"
          filled
          ref="old_password"
          :type="showPwd ? 'text' : 'password'"
          label="Password"
          class="q-ma-md"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please type your password',
            (val) => val.length <= 100 || 'Password must not exceeds 100',
            (val) => val.length > 8 || 'Password must exceeds 8',
          ]"
          @keyup.enter="checkPassword"
        >
          <template v-slot:append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn label="Check Password" color="primary" @click="checkPassword" />
      </q-step>

      <q-step :name="2" title="New Password" icon="vpn_key" :done="step > 2">
        Please enter your new password.
        <q-input
          v-model="password"
          filled
          ref="password"
          :type="showPwd ? 'text' : 'password'"
          label="Password"
          class="q-ma-md"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please type your password',
            (val) => val.length <= 100 || 'Password must not exceeds 100',
            (val) => val.length > 8 || 'Password must exceeds 8',
          ]"
          @keyup.enter="$refs.password2.focus()"
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
            (val) =>
              (val !== null && val !== '') || 'Please type your password',
            (val) => val.length <= 100 || 'Password must not exceeds 100',
            (val) => val.length > 8 || 'Password must exceeds 8',
          ]"
          @keyup.enter="submitPassword"
        >
          <template v-slot:append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn
          label="Change Password"
          color="primary"
          @click="submitPassword"
        />
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
export default {
  name: "ChangePasswordPage",
  mounted() {
    this.$q.notify({
      color: "orange",
      position: "top",
      message:
        "You can change your password only within 1 hour after you have logged in.",
      timeout: 10000,
      icon: "warning",
    });
  },
  data() {
    return {
      step: 1,
      showPwd: false,
      old_password: "",
      password: "",
      password2: "",
      correct_password: false,
    };
  },
  methods: {
    checkPassword() {
      this.$refs.old_password.validate();

      if (!this.$refs.old_password.hasError) {
        this.$store
          .dispatch(
            "user/login",
            {
              email: this.$store.state.user.user.email,
              password: this.old_password,
            } /*, { root: true }*/
          )
          .then((data) => {
            console.log(data);
            this.correct_password = true;
            this.step = 2;
          })
          .catch((error) => {
            this.loading = false;
            this.$q.notify({
              color: "negative",
              position: "top",
              message: error.response.data.message || "Something went wrong",
              icon: "error",
            });
          });
      }
    },
    submitPassword() {
      this.$refs.password.validate();
      this.$refs.password2.validate();

      if (!this.correct_password) {
        this.step = 1;
        return;
      }

      if (!this.$refs.password.hasError && !this.$refs.password2.hasError) {
        this.$store
          .dispatch(
            "user/edit",
            { password: this.password } /*, { root: true }*/
          )
          .then((data) => {
            this.$q.notify({
              icon: "done",
              color: "positive",
              message: "Password Changed",
            });
            this.$router.push({ name: "app-profile" });
          })
          .catch((error) => {
            this.loading = false;
            this.$q.notify({
              color: "negative",
              position: "top",
              message:
                error.response.data.message ||
                "Please relogin to edit your credentials",
              icon: "error",
            });
          });
      }
    },
  },
};
</script>
