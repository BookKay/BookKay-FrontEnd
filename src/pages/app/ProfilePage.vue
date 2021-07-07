<template>
  <q-page class="flex">
    <div class="col q-ml-md">
      <div class="row">
        <h2>My Profile</h2>
      </div>
      <q-separator />
      <div class="row q-my-md">
        <div class="text-h5 q-mr-lg q-mb-xs-sm q-mb-md-none col-xs-12 col-md-4">
          Username: {{ getUsername }}
        </div>
        <div class="q-mb-xs-sm q-mb-md-none col-xs-12 col-md-3">
          <q-btn
            flat
            label="Change Username"
            color="primary"
            @click="changeUsername = true"
          />
        </div>
      </div>
      <div class="row q-my-md">
        <div class="text-h5 q-mr-lg q-mb-xs-sm q-mb-md-none col-xs-12 col-md-4">
          Email: {{ getEmail }}
        </div>
        <div class="q-mb-xs-sm q-mb-md-none col-xs-12 col-md-3">
          <q-btn
            flat
            label="Change Email"
            color="primary"
            @click="changeEmail = true"
          />
        </div>
      </div>
      <div class="row q-my-md">
        <div class="text-h5 q-mr-lg q-mb-xs-sm q-mb-md-none col-xs-12 col-md-4">
          Author Name: {{ getAuthorName }}
        </div>
        <div class="q-mb-xs-sm q-mb-md-none col-xs-12 col-md-3">
          <q-btn
            flat
            label="Change Author Name"
            color="primary"
            @click="changeAuthorName = true"
          />
        </div>
      </div>
      <div class="q-my-xl">
        <div class="q-my-md">
          <q-btn
            label="Change Password"
            color="primary"
            :to="{ name: 'app-change-password' }"
            class="q-mx-lg"
          />
        </div>
        <div class="q-my-md">
          <q-btn
            label="Log Out"
            color="warning"
            class="q-mx-lg"
            @click="confirmLogOut = true"
          />
        </div>
        <div class="q-my-md">
          <q-btn
            label="Delete Account"
            color="negative"
            class="q-mx-lg"
            @click="confirmDelete = true"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="changeUsername" ref="usernameDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Username</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            ref="usernameInput"
            v-model="username"
            :rules="[
              val =>
                (val !== null && val !== '') || 'Please type your username',
              val => val.length <= 100 || 'Username must be smaller than 100'
            ]"
            autofocus
            @keyup.enter="confirmUsername"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Confirm" @click="confirmUsername" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changeEmail" ref="emailDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Email</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            ref="emailInput"
            type="email"
            dense
            v-model="email"
            :rules="[
              val => (val !== null && val !== '') || 'Please type your email',
              val => val.length <= 100 || 'Email must be smaller than 100',
              val => val.indexOf('@') != -1 || 'Please type a real email'
            ]"
            autofocus
            @keyup.enter="confirmEmail"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Confirm" @click="confirmEmail" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changeAuthorName" ref="authorNameDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Author Name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            ref="authorNameInput"
            dense
            v-model="authorName"
            :rules="[
              val =>
                (val !== null && val !== '') || 'Please type your author name',
              val => val.length <= 100 || 'Author name must be smaller than 100'
            ]"
            autofocus
            @keyup.enter="confirmAuthorName"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Confirm" @click="confirmAuthorName" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmLogOut">
      <q-card style="width: 50vw">
        <q-card-section>
          <div class="text-h6">Log Out</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to log out?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Logout" color="warning" @click="logOut()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDelete">
      <q-card>
        <q-card-section>
          <div class="text-h6">Delete Account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete your account? All your data like your
          purchased books and manuscripts will be deleted but books you
          published will remain.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteAccount()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "PageProfile",
  data() {
    return {
      username: this.$store.getters["user/userProperty"]("username"),
      email: this.$store.getters["user/userProperty"]("email"),
      authorName: this.$store.getters["user/userProperty"]("author_name"),

      changeUsername: false,
      changeEmail: false,
      changeAuthorName: false,
      confirmLogOut: false,
      confirmDelete: false
    };
  },
  computed: {
    getUsername() {
      return this.$store.getters["user/userProperty"]("username");
    },
    getEmail() {
      return this.$store.getters["user/userProperty"]("email");
    },
    getAuthorName() {
      return this.$store.getters["user/userProperty"]("author_name");
    }
  },
  methods: {
    confirmUsername() {
      this.$refs.usernameInput.validate();

      if (!this.$refs.usernameInput.hasError) {
        this.$store
          .dispatch(
            "user/edit",
            { username: this.username } /*, { root: true }*/
          )
          .then(data => {})
          .catch(error => {
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "top",
              message:
                error.response.data.message ||
                "Please relogin to edit your credentials",
              icon: "error"
            });
            this.username = this.getUsername;
          });

        this.$refs.usernameDialog.hide();
      }
    },
    confirmEmail() {
      this.$refs.emailInput.validate();
      if (!this.$refs.emailInput.hasError) {
        this.$store
          .dispatch("user/edit", { email: this.email } /*, { root: true }*/)
          .then(data => {})
          .catch(error => {
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "top",
              message:
                error.response.data.message ||
                "Please relogin to edit your credentials",
              icon: "error"
            });
            this.email = this.getEmail;
          });

        this.$refs.emailDialog.hide();
      }
    },
    confirmAuthorName() {
      this.$refs.authorNameInput.validate();
      if (!this.$refs.authorNameInput.hasError) {
        this.$store
          .dispatch(
            "user/edit",
            { author_name: this.authorName } /*, { root: true }*/
          )
          .then(data => {})
          .catch(error => {
            console.log(error);
            this.$q.notify({
              color: "negative",
              position: "top",
              message:
                error.response.data.message ||
                "Please relogin to edit your credentials",
              icon: "error"
            });
            this.authorName = this.getAuthorName;
          });

        this.$refs.authorNameDialog.hide();
      }
    },
    logOut() {
      this.$store.dispatch("user/logout").then(() => {
        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "Successfully Logged Out"
        });
        this.$router.replace({ name: "home-homepage" });
      });
    },
    deleteAccount() {
      this.$store
        .dispatch("user/deleteUser" /*, { root: true }*/)
        .then(data => {
          this.$q.notify({
            icon: "done",
            color: "positive",
            message: "Successfully Deleted Account"
          });
          this.$router.replace({ name: "home-homepage" });
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message:
              error.response.data.message ||
              "Please relogin to edit your credentials",
            icon: "error"
          });
        });
    }
  }
};
</script>
