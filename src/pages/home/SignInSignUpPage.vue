<template>
  <div class="container" :class="containerClassObject">
    <div class="forms-container">
      <div class="signin-signup">
        <q-form
          class="q-ma-lg sign-in-form"
          @submit.prevent.stop="signInSubmit"
        >
          <h2 class="title">Sign in</h2>
          <!-- <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="Username" />
          </div> -->
          <q-input
            v-model="signIn.user.email"
            ref="signInEmail"
            type="email"
            label="Email"
            class="q-ma-md"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your email',
              (val) => val.length <= 100 || 'Email must be smaller than 100',
              (val) => val.indexOf('@') != -1 || 'Please type a real email',
            ]"
            @keydown.enter.prevent="$refs.signInPassword.focus()"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            ref="signInPassword"
            label="Password"
            class="q-ma-md"
            v-model="signIn.user.password"
            :type="signIn.showPwd ? 'text' : 'password'"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your password',
              (val) => val.length <= 100 || 'Password must not exceeds 100',
              (val) => val.length > 8 || 'Password must exceeds 8',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" />
            </template>
            <template #append>
              <q-icon
                :name="signIn.showPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="signIn.showPwd = !signIn.showPwd"
              />
            </template>
          </q-input>
          <q-btn
            label="Login"
            type="submit"
            :ripple="{ early: true }"
            class="btn solid"
          >
            <q-spinner-hourglass
              v-if="authStatus == 'loading'"
              color="white"
              size="1.2em"
            />
          </q-btn>
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
        <q-form class="sign-up-form" @submit.prevent.stop="signUpSubmit">
          <h2 class="title">Sign up</h2>
          <!-- <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="Username" />
          </div>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" placeholder="Email" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="Password" />
          </div>
          <q-btn label="Register" :ripple="{ early: true }" class="btn solid" /> -->
          <q-input
            v-model="signUp.user.username"
            ref="signUpUsername"
            label="Username"
            class="q-ma-md"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your username',
              (val) =>
                val.length <= 100 || 'Username must not be greater than 100',
            ]"
            @keydown.enter.prevent="$refs.signUpEmail.focus()"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-user" />
            </template>
          </q-input>
          <q-input
            v-model="signUp.user.email"
            ref="signUpEmail"
            type="email"
            label="Email"
            class="q-ma-md"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your email',
              (val) => val.length <= 100 || 'Email must be smaller than 100',
              (val) => val.indexOf('@') != -1 || 'Please type a real email',
            ]"
            @keydown.enter.prevent="$refs.signUpPassword.focus()"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-envelope" />
            </template>
          </q-input>
          <q-input
            v-model="signUp.user.password"
            ref="signUpPassword"
            :type="signUp.showPwd ? 'text' : 'password'"
            label="Password"
            class="q-ma-md"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your password',
              (val) => val.length <= 100 || 'Password must not exceeds 100',
              (val) => val.length > 8 || 'Password must exceeds 8',
            ]"
            @keydown.enter.prevent="$refs.signUpPassword2.focus()"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" />
            </template>

            <template v-slot:append>
              <q-icon
                :name="signUp.showPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="signUp.showPwd = !showPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="signUp.password2"
            ref="signUpPassword2"
            :type="signUp.showPwd ? 'text' : 'password'"
            label="Reenter Password"
            class="q-ma-md"
            lazy-rules="ondemand"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your password',
              (val) => val.length <= 100 || 'Must not exceed 100',
              (val) => val.length > 8 || 'Password must exceeds 8',
              (val) => val == this.signUp.user.password || 'Password not same',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-lock" />
            </template>

            <template v-slot:append>
              <q-icon
                :name="signUp.showPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="signUp.showPwd = !signUp.showPwd"
              />
            </template>
          </q-input>
          <q-btn
            label="Register"
            type="submit"
            :ripple="{ early: true }"
            class="btn solid"
          >
            <q-spinner-hourglass
              v-if="authStatus == 'loading'"
              color="white"
              size="1.2em"
            />
          </q-btn>

          <!-- <p class="social-text">Or Sign up with social platforms</p>
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
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>New here ?</h3>
          <p>
            Register your account now to purchase your favourite books or write
            the next blockbuster!
          </p>
          <q-btn
            class="btn transparent"
            color="white"
            outline
            label="Sign Up"
            @click="changeToSignUp"
          />
        </div>
        <img src="svg/exciting_news.svg" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>One of us ?</h3>
          <p>
            Log back in to see what has changed since you last visited here; new
            books are waiting for you at our book store.
          </p>
          <q-btn
            class="btn transparent"
            color="white"
            outline
            label="Sign In"
            @click="changeToSignIn"
          />
        </div>
        <img src="svg/reading_book.svg" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignInSignUpPage",
  data() {
    return {
      containerClassObject: {
        "sign-up-mode": false,
      },
      signIn: { showPwd: false, user: { email: "", password: "" } },
      signUp: {
        showPwd: false,
        password2: "",

        user: {
          username: "",
          author_name: "",
          email: "",
          password: "",
        },
      },
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

    if (this.$route.name == "home-sign-up") {
      this.changeToSignUp();
    }
  },
  methods: {
    changeToSignUp() {
      this.containerClassObject["sign-up-mode"] = true;
      this.$router.push({ name: "home-sign-up" });
    },
    changeToSignIn() {
      this.containerClassObject["sign-up-mode"] = false;
      this.$router.push({ name: "home-sign-in" });
    },

    async signUpSubmit() {
      this.$refs.signUpUsername.validate();
      this.$refs.signUpEmail.validate();
      this.$refs.signUpPassword.validate();
      this.$refs.signUpPassword2.validate();

      if (
        this.$refs.signUpUsername.hasError ||
        this.$refs.signUpEmail.hasError ||
        this.$refs.signUpPassword.hasError ||
        this.$refs.signUpPassword2.hasError
      ) {
        this.formHasError = true;
      } else {
        this.signUp.user.author_name = this.signUp.user.username;

        try {
          await this.$store.dispatch("user/register", this.signUp.user);
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

    async signInSubmit() {
      this.$refs.signInEmail.validate();
      this.$refs.signInPassword.validate();

      if (
        this.$refs.signInEmail.hasError ||
        this.$refs.signInPassword.hasError
      ) {
        this.formHasError = true;
      } else {
        try {
          await this.$store.dispatch("user/login", this.signIn.user);
          this.$q.notify({
            icon: "done",
            color: "positive",
            message: "Welcome Back",
          });
          if (this.$route.query == {}) {
            this.$router.replace({ path: this.$route.query.redirect });
          } else {
            this.$router.replace({ name: "app-read" });
          }
        } catch (error) {
          //displaying pretty messages
          let msg = error.response.data[0];
          if (error.response.status == 404) {
            msg = "Sorry no user with this email is found.";
          }

          //Notifying user about the request error
          this.$q.notify({
            color: "negative",
            position: "top",
            message: msg || error.response.statusText || "Something went wrong",
            icon: "error",
            actions: [
              {
                label: "Register Instead?",
                color: "white",
                handler: () => {
                  this.$router.push({ name: "home-sign-up" });
                },
              },
            ],
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
  text-align: center;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 120px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>
