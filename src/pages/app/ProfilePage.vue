<template>
  <q-page>
    <div class="theme-img">
      <image-circle
        :image="`https://avatars.dicebear.com/api/micah/${this.getUsername}.svg?mouth=smile`"
      />
    </div>

    <div class="list-container">
      <q-list>
        <div v-for="(field, index) in fields" :key="index">
          <q-item
            clickable
            v-ripple.early
            style="border-radius: 30px"
            @click="field.clickHandler"
          >
            <q-item-section>
              <q-item-label>{{ field.label }}</q-item-label>
              <q-item-label caption :lines="field.lines ? field.lines : '2'">{{
                field.value
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="keyboard_arrow_right" color="black" />
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </div>
      </q-list>
    </div>

    <div class="attribution">
      The above profile image is automatically generated based on your username.
      It is made possible thanks to the awesome works of
      <a href="https://dribbble.com/micahlanier" target="_blank"
        >Micah Lanier
      </a>
      (For the artworks) as well as
      <a href="https://avatars.dicebear.com/" target="_blank"
        >DiceBear Avatar</a
      >
      (For AutoGenerating these avatars).
    </div>

    <app-prompt-dialog
      v-for="(dialog, index) in promptDialogs"
      :key="index"
      :open="dialog.state"
      :label="dialog.label"
      :value="dialog.value"
      :rules="dialog.rules"
      @confirmed="dialog.confirmHandler"
    />

    <app-confirm-dialog
      v-for="(dialog, index) in confirmDialogs"
      :key="index"
      :open="dialog.state"
      :header="dialog.label"
      :text="dialog.text"
      :btnLabel="dialog.btnLabel"
      :btnColor="dialog.btnColor"
      @confirmed="dialog.confirmHandler"
    />
  </q-page>
</template>

<script>
import AppConfirmDialog from 'src/components/AppConfirmDialog.vue';
import AppPromptDialog from 'src/components/AppPromptDialog.vue';
import ImageCircle from 'src/components/ImageCircle.vue';

export default {
  name: 'PageProfile',
  components: { AppPromptDialog, AppConfirmDialog, ImageCircle },
  data() {
    return {
      username: this.$store.getters['user/userProperty']('username'),
      email: this.$store.getters['user/userProperty']('email'),
      authorName: this.$store.getters['user/userProperty']('author_name'),
      biography: this.$store.getters['user/userProperty']('biography'),
      dateJoined: this.$store.getters['user/userProperty']('date_joined'),

      usernameDialog: false,
      emailDialog: false,
      authorNameDialog: false,
      biographyDialog: false,
      logOutDialog: false,
      deleteDialog: false,
    };
  },
  computed: {
    getUsername() {
      return this.$store.getters['user/userProperty']('username');
    },
    getEmail() {
      return this.$store.getters['user/userProperty']('email');
    },
    getAuthorName() {
      return this.$store.getters['user/userProperty']('author_name');
    },
    getBiography() {
      return this.$store.getters['user/userProperty']('biography');
    },
    getDateJoined() {
      return this.$store.getters['user/userProperty']('date_joined');
    },
    fields() {
      return [
        {
          label: 'Username',
          value: this.getUsername,
          clickHandler: this.changeUsername,
        },
        {
          label: 'Email',
          value: this.getEmail,
          clickHandler: this.changeEmail,
        },
        // {
        //   label: 'Edit Profile Image',
        //   value: '',
        //   clickHandler: this.changeProfileImage,
        // },
        {
          label: 'Author Name',
          value: this.getAuthorName,
          clickHandler: this.changeAuthorName,
        },
        {
          label: 'Biography',
          value: this.getBiography,
          clickHandler: this.changeBiography,
        },
        {
          label: 'Date Joined',
          value: this.dateJoined,
        },
        {
          label: 'Change Password',
          clickHandler: this.changePassword,
        },
        {
          label: 'Logout',
          clickHandler: this.confirmLogOut,
        },
        {
          label: 'Delete Account',
          clickHandler: this.confirmDelete,
        },
        // {
        //   label: 'Toggle Dark Mode',
        //   clickHandler: this.$q.dark.set(!this.$q.dark.isActive),
        // },
      ];
    },

    promptDialogs() {
      return [
        {
          label: 'Username',
          state: this.usernameDialog,
          value: this.getUsername,
          rules: [
            (val) =>
              (val !== null && val !== '') || 'Please type your username',
            (val) => val.length <= 100 || 'Username must be smaller than 100',
          ],
          confirmHandler: this.confirmUsername,
        },
        {
          label: 'Email',
          state: this.emailDialog,
          value: this.getEmail,
          rules: [
            (val) => (val !== null && val !== '') || 'Please type your email',
            (val) => val.length <= 100 || 'Email must be smaller than 100',
            (val) => val.indexOf('@') != -1 || 'Please type a real email',
          ],
          confirmHandler: this.confirmEmail,
        },
        {
          label: 'Author Name',
          state: this.authorNameDialog,
          value: this.getAuthorName,
          rules: [
            (val) =>
              (val !== null && val !== '') || 'Please type your author name',
            (val) =>
              val.length <= 100 || 'Author name must be smaller than 100',
          ],
          confirmHandler: this.confirmAuthorName,
        },
        {
          label: 'Biography',
          state: this.biographyDialog,
          value: this.getBiography,
          rules: [
            (val) =>
              val.length <= 5000 ||
              'Your biography must be smaller than 5000 letters',
          ],
          confirmHandler: this.confirmBiography,
        },
      ];
    },

    confirmDialogs() {
      return [
        {
          label: 'Log Out',
          state: this.logOutDialog,
          text: 'Are you sure you want to log out?',
          btnLabel: 'Logout',
          btnColor: 'warning',
          confirmHandler: this.logOut,
        },
        {
          label: 'Delete Account',
          state: this.deleteDialog,
          text: `Are you sure you want to delete your account? All your data like your
          purchased books and manuscripts will be deleted but books you
          published will remain.`,
          btnLabel: 'Delete',
          btnColor: 'negative',
          confirmHandler: this.deleteAccount,
        },
      ];
    },
  },
  methods: {
    //Methods for opening up the dialogs
    changeUsername() {
      this.usernameDialog = true;
    },
    changeEmail() {
      this.emailDialog = true;
    },
    changeProfileImage() {
      this.$router.push({ name: 'app-profile-image-edit' });
    },
    changeAuthorName() {
      this.authorNameDialog = true;
    },
    changeBiography() {
      this.biographyDialog = true;
    },
    changePassword() {
      this.$router.push({ name: 'app-change-password' });
    },
    confirmLogOut() {
      this.logOutDialog = true;
    },
    confirmDelete() {
      this.deleteDialog = true;
    },

    //Methods for handling confirmations from the dialogs
    confirmUsername(newUsername) {
      this.usernameDialog = false;

      if (newUsername && this.username != newUsername) {
        this.$store
          .dispatch('user/edit', { username: newUsername } /*, { root: true }*/)
          .then()
          .catch((error) => {
            console.log(error);
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                error.response.data.message ||
                'Please relogin to edit your credentials',
              icon: 'error',
            });
            this.username = this.getUsername;
          });
      }
    },
    confirmEmail(newEmail) {
      this.emailDialog = false;
      if (newEmail && this.email != newEmail) {
        this.$store
          .dispatch('user/edit', { email: newEmail } /*, { root: true }*/)
          .then()
          .catch((error) => {
            console.log(error);
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                error.response.data.message ||
                'Please relogin to edit your credentials',
              icon: 'error',
            });
            this.email = this.getEmail;
          });
      }
    },
    confirmAuthorName(newAuthorName) {
      this.authorNameDialog = false;
      if (newAuthorName && this.authorName != newAuthorName) {
        this.$store
          .dispatch(
            'user/edit',
            { author_name: newAuthorName } /*, { root: true }*/
          )
          .then()
          .catch((error) => {
            console.log(error);
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                error.response.data.message ||
                'Please relogin to edit your credentials',
              icon: 'error',
            });
            this.authorName = this.getAuthorName;
          });
      }
    },
    confirmBiography(newBiography) {
      this.biographyDialog = false;
      if (newBiography && this.getBiography != newBiography) {
        this.$store
          .dispatch(
            'user/edit',
            { biography: newBiography } /*, { root: true }*/
          )
          .then()
          .catch((error) => {
            console.log(error);
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                error.response.data.message ||
                'Please relogin to edit your credentials',
              icon: 'error',
            });
            this.biography = this.getBiography;
          });
      }
    },

    logOut(confirm) {
      this.logOutDialog = false;
      if (confirm) {
        this.$store
          .dispatch('user/logout', {
            id: this.$store.getters['user/userProperty']('id'),
          })
          .then(() => {
            this.$q.notify({
              icon: 'done',
              color: 'positive',
              message: 'Successfully Logged Out',
            });
            this.$router.replace({ name: 'home-homepage' });
          });
      }
    },
    deleteAccount(confirm) {
      this.deleteDialog = false;
      if (confirm) {
        this.$store
          .dispatch('user/deleteUser' /*, { root: true }*/)
          .then((data) => {
            this.$q.notify({
              icon: 'done',
              color: 'positive',
              message: 'Successfully Deleted Account',
            });
            this.$router.replace({ name: 'home-homepage' });
          })
          .catch((error) => {
            console.log(error);
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                error.response.data.message ||
                'Please relogin to edit your credentials',
              icon: 'error',
            });
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
h1 {
  color: #0d6e5f;
}

h2 {
  color: #004036;
}

.heading {
  display: inline-block;
  border-radius: 50px;
  cursor: pointer;
  background-color: rgba(183, 226, 225);
  padding: 0 20px;
  margin: 5px 10px;
}

.heading h1 {
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  font-weight: 700;
  line-height: 2em;
}

.theme-img {
  margin-top: 20px;
  margin-bottom: 10px;
}

.list-container {
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
}

.attribution {
  width: 80vw;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  font-size: 12px;
  color: grey;
  font-weight: 300;
}

.attribution a {
  color: black;
}

@media (max-width: 480px) {
  .list-container {
    width: 98vw;
  }

  .attribution {
    width: 90vw;
  }
}
</style>
