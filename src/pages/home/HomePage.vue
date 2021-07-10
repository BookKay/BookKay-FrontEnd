<template>
  <q-page class="flex">
    <div
      class=" hero window-width  z-top relative-position"
      style="min-height: 110vh"
    >
      <div class="absolute-center ">
        <h1 class="q-ma-md text-primary" style="font-weight: bold">BookKay</h1>

        <q-btn
          color="primary"
          label="Register"
          class="q-ma-md "
          :to="{ name: 'home-sign-up' }"
          size="large"
        />
      </div>
    </div>
    <div
      class="vision window-width  z-top relative-position "
      style="min-height: 120vh"
    >
      <div class="absolute-left q-ma-lg ">
        <h1 class="">Our Mission</h1>
        <div style="max-width: 400px" class="q-my-lg">
          <q-list bordered>
            <q-expansion-item
              group="somegroup"
              icon="biotech"
              label="Create Innovate digital book technology"
              header-class="text-primary"
            >
              <q-card class="bg-primary text-white">
                <q-card-section>
                  In a world where jokes are shared via memes and news read on
                  screen, it is now time that ebooks become the epitome of
                  technology. And that's exactly what we aim to do.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item
              group="somegroup"
              icon="local_library"
              label="Promote Reading of Books"
              header-class="text-secondary"
            >
              <q-card class="bg-secondary text-white">
                <q-card-section>
                  Literature is the heritage of humanity, so we aims to
                  encourages reading, mainly amongst young people who were born
                  with phones in hand. We aim to achieve this by creating an
                  immersive reading platform with cutting-edge technologies.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item
              group="somegroup"
              icon="edit"
              label="Encourage writing"
              header-class="text-accent"
            >
              <q-card class="bg-accent text-white">
                <q-card-section>
                  We wish to promotes writing, especially from indie hobbyist
                  writers, through our support features and a global audience
                  potential. And all this for FREE!
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
    <div
      class="reader window-width  z-top relative-position"
      style="min-height: 120vh"
    >
      <div class="absolute-left " v-if="$q.screen.gt.sm">
        <div class="text-area--left">
          <h1 class="q-mt-none text-primary q-mx-lg">Are you a reader?</h1>

          <ul class="text-primary text-h5 q-ma-lg q-pb-lg">
            <li>Intuitive, easy-to-concentrate reading layout</li>
            <li>Simple, yet innovative, zen mode</li>
            <li>Aesthetically pleasing page turning effects</li>
          </ul>

          <q-btn
            color="primary"
            label="Let's read now"
            class="q-ma-lg "
            :to="{ name: 'home-browse' }"
            size="large"
            rounded
          />
        </div>
      </div>
      <div class="absolute-bottom-left" v-else>
        <div class="text-area--left">
          <h4 class="q-ma-none q-pa-lg text-primary">Are you a reader?</h4>

          <ul class="text-primary text-body2 q-ma-sm ">
            <li>Intuitive, easy-to-concentrate reading layout</li>
            <li>Simple, yet innovative, zen mode</li>
            <li>Aesthetically pleasing page turning effects</li>
          </ul>

          <q-btn
            color="primary"
            label="Let's read now"
            class="q-ma-sm "
            :to="{ name: 'home-browse' }"
            size="large"
            rounded
          />
        </div>
      </div>
    </div>
    <div
      class="writer window-width  z-top relative-position"
      style="min-height: 120vh"
    >
      <div class="absolute-right " v-if="$q.screen.gt.sm">
        <div class="text-area--right">
          <h1 class="q-mt-none text-primary q-mx-lg">Are you a writer?</h1>

          <ul class="text-primary text-h5 q-ma-lg q-pb-lg">
            <li>Structured layout - front matter, chapter, and back matter</li>
            <li>State-of-the-art notebook themed text editor</li>
            <li>Simple yet innovative zen mode</li>
          </ul>

          <q-btn
            color="primary"
            label="Let's write now"
            class="q-ma-lg "
            :to="{ name: 'write-editor' }"
            size="large"
            rounded
          />
        </div>
      </div>
      <div class="absolute-bottom-right" v-else>
        <div class="text-area--right">
          <h4 class="q-ma-none q-pa-lg text-primary">Are you a writer?</h4>

          <ul class="text-primary text-body2 q-ma-sm">
            <li>Structured layout - front matter, chapter, and back matter</li>
            <li>State-of-the-art notebook themed text editor</li>
            <li>Simple yet innovative zen mode</li>
          </ul>

          <q-btn
            color="primary"
            label="Let's write now"
            class="q-ma-sm q-ml-lg"
            :to="{ name: 'write-editor' }"
            size="large"
            rounded
          />
        </div>
      </div>
    </div>
    <div
      class="end window-width  z-top relative-position"
      style="min-height: 110vh"
    >
      <div class="absolute-top ">
        <h5 class="q-ma-md text-white">
          Made with
          <span style="color: red">&hearts;</span> by Kevin @ Kyaw Thiha
        </h5>
        <h6 class="q-ma-md text-white">
          And most importantly, all of these features are available for FREE!!!
          So, what are you waiting for? Register now!!!
        </h6>

        <q-btn
          color="primary"
          label="Register"
          class="q-ma-md "
          :to="{ name: 'home-sign-up' }"
          size="large"
        />
      </div>
      <div class="absolute-bottom text-white">
        <p>
          Special thankies to:
          <a href="https://www.quasar.dev" target="blank">Quasar, </a>
          <a href="https://github.com/Nodlik/StPageFlip" target="blank"
            >Oleg Nodlik(St PageFlip),
          </a>
          <a href="https://codepen.io/austinmallar/pen/ExVzrqG" target="blank"
            >Austin Maller(Animation in reader),
          </a>

          <a>And of course wonderful open-source community as a whole! </a>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "HomePage",
  mounted() {
    const reader = document.querySelector(".reader");
    const readerUrl =
      "https://res.cloudinary.com/bookkay/image/upload/e_blur:100/v1624301274/BookKay/HomePage/read-book_mp2k0m.png";
    reader.style.backgroundImage = `url('${readerUrl}')`;
  }
};
</script>
<style lang="scss" scoped>
.hero {
  background-image: url("https://res.cloudinary.com/bookkay/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1624301263/BookKay/HomePage/hero_mzfjvb.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.vision {
  background-color: #ffffff;

  background-repeat: no-repeat;
  background-size: cover;
}

.vision::before {
  content: "";
  background-image: url("https://res.cloudinary.com/bookkay/image/upload/v1624301271/BookKay/HomePage/books_fvoasf.jpg");
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.25;
}

.reader {
  background-color: #ffffff;

  background-repeat: no-repeat;
  background-size: cover;
}

/*.reader::before {
  content: "";
  //background-image: url(this.url);
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.3;
}*/

.writer {
  background-color: #ffffff;

  background-repeat: no-repeat;
  background-size: cover;
}

.writer::before {
  content: "";
  background-image: url("https://res.cloudinary.com/bookkay/image/upload/v1624301290/BookKay/HomePage/write-book_fzh4qt.png");
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.75;
}

.end {
  background-image: url("https://res.cloudinary.com/bookkay/image/upload/v1624301279/BookKay/HomePage/rose-book_tpwrkt.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  a {
    color: white;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
}

.text-area {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    42deg,
    rgba(249, 202, 167, 1) 0%,
    rgb(253, 245, 166) 35%,
    rgba(254, 200, 193, 1) 100%
  );
}

.text-area--right {
  @extend .text-area;

  border-radius: 50px 0 0 50px;
}

.text-area--left {
  @extend .text-area;

  border-radius: 0 50px 50px 0;
}
</style>
