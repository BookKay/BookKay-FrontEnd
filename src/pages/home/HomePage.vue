<template>
  <q-page>
    <section class="main_page">
      <input type="checkbox" id="check" />
      <header class="main">
        <h2>
          <a href="#" class="logo"> Book<span class="kay">Kay</span></a>
        </h2>
        <div class="navigation">
          <!-- <a href="#">Store</a> -->
          <div v-if="!$store.getters['user/isLoggedIn']">
            <q-btn
              flat
              label="Store"
              :ripple="{ early: true }"
              :to="{ name: 'home-shop' }"
            ></q-btn>
            <q-btn
              flat
              label="Sign In"
              :ripple="{ early: true }"
              :to="{ name: 'home-sign-in' }"
            ></q-btn>
          </div>
          <div v-else>
            <q-btn
              color="black"
              icon="local_library"
              label="Go To App"
              class="q-mx-xs"
              :to="{ name: 'app-read' }"
              :ripple="{ early: true }"
            />
          </div>
        </div>
        <!-- <label for="check">
          <q-icon name="menu" />
          <q-icon name="close" />
        </label> -->
      </header>
      <div class="content">
        <div class="info">
          <h2>Main<br /><span>Goal!</span></h2>
          <p>
            To encourage teenagers to enjoy reading and writing books through
            uses of innovative technology
          </p>
        </div>
      </div>
    </section>

    <div class="intro">
      <div class="intro-text">
        <h1 class="hide">
          <span class="text">Read & Write</span>
        </h1>
        <h1 class="hide">
          <span class="text">with</span>
        </h1>
        <h1 class="hide">
          <span class="text">Zen mode.</span>
        </h1>
      </div>
    </div>
    <div class="slider"></div>
    <section class="second_page">
      <header class="main-header">
        <h1><span>Main mission</span></h1>
      </header>
      <main class="container">
        <section class="card" data-aos="fade-right">
          <img src="homepage/women.svg" alt="women" class="sec_page_images" />
          <div class="three_content">
            <h3>Create Innovate digital book technology</h3>
            <p>
              In a world where jokes are shared via memes and news read on
              screen, it is now time that ebooks become the epitome of
              technology. And that's exactly what we aim to do.
            </p>
          </div>
        </section>

        <section class="card" data-aos="fade-left">
          <img
            src="homepage/sec_women.svg"
            alt="women"
            class="sec_page_images"
          />
          <div class="three_content">
            <h3>Promote Reading of Books</h3>
            <p>
              Literature is the heritage of humanity, so we aims to encourages
              reading, mainly amongst young people who were born with phones in
              hand. We aim to achieve this by creating an immersive reading
              platform with cutting-edge technologies.
            </p>
          </div>
        </section>

        <section class="card" data-aos="fade-right">
          <img
            src="homepage/third_women.svg"
            alt="women"
            class="sec_page_images"
          />
          <div class="three_content">
            <h3>Encourage writing</h3>
            <p>
              We wish to promotes writing, especially from indie hobbyist
              writers, through our support features and a global audience
              potential. And all this for FREE!
            </p>
          </div>
        </section>
      </main>
    </section>

    <section class="third_page">
      <header class="third-header">
        <h1>Are you a reader?</h1>
        <ul>
          <li class="features">
            <h2>Features</h2>
            <section class="info-2" data-aos="zoom-in-right">
              <li>Immersive, easy-to-concentrate reading layout</li>
              <li>Rest & Chill Mode</li>
              <li>Dark Mode</li>
              <li>Simple, yet innovative, zen mode</li>
              <li>Aesthetically pleasing page turning effects</li>
            </section>
          </li>
        </ul>
      </header>
      <div class="container">
        <!-- <div class="card">
          <div class="imgBox">
            <img
              src="https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png"
            />
            <h2>Book_Name</h2>
          </div>
          <div class="content">
            <p>bla bla ...........</p>
            <a href="#" class="detail">Read Now</a>
          </div>
        </div>
        <div class="card">
          <div class="imgBox">
            <img
              src="https://res.cloudinary.com/bookkay/image/upload/v1625774456/BookKay/Front%20Cover/front_cover_9cc9a0aa-e026-11eb-a5b9-ba6b82820b1a.png"
            />
            <h2>Book_Name</h2>
          </div>
          <div class="content">
            <p>bla bla ...........</p>
            <a href="#" class="detail">Read Now</a>
          </div>
        </div>
        <div class="card">
          <div class="imgBox">
            <img
              src="https://res.cloudinary.com/bookkay/image/upload/v1625773456/BookKay/Front%20Cover/front_cover_fd26a3e2-e023-11eb-a5b9-ba6b82820b1a.png"
            />
            <h2>Book_Name</h2>
          </div>
          <div class="content">
            <p>bla bla ...........</p>
            <a href="#" class="detail">Read Now</a>
          </div>
        </div> -->

        <div v-for="book in topBooks.value" :key="book.id" class="card">
          <div class="imgBox">
            <img :src="book.front_cover" />
            <h2>{{ book.title }}</h2>
          </div>
          <div class="content">
            <p>{{ book.author_name }}</p>
            <q-btn
              color="white"
              text-color="black"
              filled
              rounded
              label="Read Now"
              :ripple="{ early: true }"
              :to="{ name: 'read-book', query: { book_id: book.id } }"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="fourth_page">
      <header class="fourth-header">
        <h1>Are you a writer?</h1>

        <ul>
          <li class="features">
            <h2>Features</h2>

            <section class="info-3" data-aos="zoom-in-right">
              <li>Structured, organised layout</li>
              <li>State-of-the-art intuitive text editor</li>
              <li>Numerous Keyboard Shortcuts for slick control</li>
              <li>Simple yet innovative zen mode</li>
            </section>
          </li>
        </ul>

        <q-btn
          color="black"
          icon="edit"
          label="Try Editor"
          class="q-mt-md"
          :to="{ name: 'write-editor' }"
          :ripple="{ early: true }"
        />
      </header>

      <h4 class="writer">A fellow writer?<br /></h4>
      <div class="typing">
        <div class="static-txt">We offer features like</div>
        <ul class="dynamic-txts">
          <li><span>Typing</span></li>
          <li><span>Bold</span></li>
          <li><span>Italic</span></li>
          <li><span>Underline</span></li>
          <li><span>Link</span></li>
        </ul>
      </div>
    </section>

    <footer>
      <div class="container">
        <div class="sec aboutus">
          <h2>About Us</h2>
          <p>
            Two lonely guy that don't have girlfriends created this website.
            This website is for nerds who don't have girlfriends.
          </p>
          <ul class="sci">
            <li>
              <a href="#"><i class="fab fa-facebook-f"></i></a>
            </li>

            <li>
              <a href="#"><i class="fab fa-twitter"></i></a>
            </li>
            <li>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </li>
          </ul>
        </div>
        <!-- <div class="sec quickLinks">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Contacts</a></li>
          </ul>
        </div>
        <div class="sec contact">
          <h2>Contact Info</h2>
          <ul class="Info">
            <li>
              <span><i class="fas fa-phone-alt"></i></span>
              <p><a href="tel:12345678900">+1 234 567 8900</a></p>
            </li>
            <li>
              <span><i class="fas fa-envelope"></i></span>
              <p>
                <a href="mailto:sex@email.com">NeedaHoneyinMyLife@email.com</a>
              </p>
            </li>
          </ul>
        </div> -->
      </div>
      <div class="copyrightText">
        <p>Copyright Bookkay. All Rights Reserved.</p>
      </div>
    </footer>
  </q-page>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";

import { onMounted, reactive } from "vue";
import { api } from "boot/axios";
import { gsap } from "gsap";

export default {
  name: "HomePage",
  setup() {
    let topBooks = reactive({ value: [] });

    onMounted(async () => {
      //Initialising AOS for scroll revealing effect
      AOS.init({
        offset: 200,
        delay: 200,
        duration: 1000,
      });

      //Initialising gsap for animations
      const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

      tl.to(".text", { y: "0%", duration: 1.5, stagger: 0.25 });
      tl.to(".slider", { y: "-100%", duration: 2, delay: 0.5 });
      tl.to(".intro", { y: "-100%", duration: 1 }, "-=1.5");
      tl.fromTo(".main", { opacity: 0 }, { opacity: 1, duration: 1 });
      tl.fromTo(".content", { opacity: 0 }, { opacity: 1, duration: 0.7 });
      tl.fromTo(".info", { opacity: 0 }, { opacity: 1, duration: 1 });

      //Fetching books
      topBooks.value = await fetchTopBooks();
    });

    async function fetchTopBooks() {
      let response = await api.get("books/top_read", {
        params: {
          fields: "id,title,author_name,front_cover",
        },
      });
      console.log(response);
      return response.data;
    }

    console.log(topBooks);

    return { topBooks };
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap");
/*font imported: Montserrat*/
* {
  // margin: 0;
  // padding: 0;
  // box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

.main_page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: url("../../../public/homepage/background.svg") no-repeat;
  background-size: cover;
  background-position: center;
}

.main {
  position: relative;
  top: 0;
  width: 100%;
  padding: 30px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header .logo {
  position: relative;
  color: #000;
  font-size: 30px;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 5px 10px;
  /*border: solid 3px #fff;
        border-radius: 14px;*/
}

.kay {
  color: #096658;
  border: solid 3px white;
  border-radius: 8px;
}

header .navigation a {
  color: #000;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 2px 15px;
  border-radius: 20px;
  transition: 0.4s;
  transition-property: background;
}

header .navigation a:not(:last-child) {
  margin-right: 30px;
}

header .navigation a:hover {
  background: #f0faf9;
}

.main_page .content {
  max-width: 650px;
  margin: 100px 100px;
  /* margin: 10px; */
  background: rgba(240, 250, 249, 0.9);
  border-radius: 30px;
  padding: 25px;
}

.main_page .content .info h2 {
  color: #0d6e5f;
  font-size: 55px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 60px;
  margin-bottom: 30px;
}

.main_page .content .info h2 span {
  color: #004036;
  font-size: 50px;
  font-weight: 700;
}

.main_page .content .info p {
  font-size: 18px;
  font-weight: 550;
  margin-bottom: 40px;
}

label {
  display: none;
}

#check {
  z-index: 3;
  display: none;
}

@media (max-width: 650px) {
  header .navigation {
    display: none;
  }

  label {
    display: block;
    font-size: 25px;
    cursor: pointer;
    transition: 0.4s;
    transition-property: color;
  }

  label:hover {
    color: #f0faf9;
  }

  label .fa-times {
    display: none;
  }

  #check:checked ~ header .navigation {
    z-index: 2;
    position: fixed;
    background: rgba(183, 226, 225, 0.95);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #check:checked ~ header .navigation a {
    font-weight: 700;
    margin-right: 0;
    margin-bottom: 50px;
    letter-spacing: 2px;
  }

  #check:checked ~ header label .fa-bars {
    display: none;
  }

  #check:checked ~ header label .fa-times {
    z-index: 2;
    display: block;
    position: fixed;
  }

  label .fa-bars {
    position: absolute;
  }

  header .logo {
    position: absolute;
    bottom: -6px;
  }

  .content .info h2 {
    font-size: 45px;
    line-height: 50px;
  }

  .content .info h2 span {
    font-size: 40px;
    font-weight: 600;
  }

  .content .info p {
    font-size: 14px;
  }
}

@media (max-width: 560px) {
  .content .info h2 {
    font-size: 35px;
    line-height: 40px;
  }

  .content .info h2 span {
    font-size: 30px;
    font-weight: 600;
  }

  .content .info p {
    font-size: 14px;
  }

  .main_page {
    background-image: url("../../../public/homepage/background_stupigirl.svg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: left;
  }
}

.intro {
  background: #0d6e5f;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider {
  background-image: url("../../../public/homepage/meditation.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
}

.intro-text {
  color: rgb(232, 236, 236);
  font-size: 2rem;
}

.hide {
  background: #0d6e5f;
  overflow: hidden;
}

.hide span {
  transform: translateY(100%);
  display: inline-block;
}

.second_page {
  background: rgb(249, 255, 255);
  background: -moz-linear-gradient(
    180deg,
    rgba(249, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -webkit-linear-gradient(
    180deg,
    rgba(249, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background: linear-gradient(
    180deg,
    rgba(249, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f9ffff",endColorstr="#ffffff",GradientType=1);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  min-height: 105vh;
  position: relative;
}

section .second_page .container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second_page h3 {
  color: black;
  font-weight: 700;
}

.second_page p {
  color: black;
  font-weight: 600;
  line-height: 22px;
  text-align: justify;
}

.second_page .container {
  margin: 0;
  margin-top: 0px;
  overflow: auto;
  padding: 0 10rem;
  font-family: "Montserrat", sans-serif;
  font-size: 1.05rem;
}

.second_page .main-header {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
}
.second_page .main-header h1 {
  font-size: 40px;
  font-weight: 900;
  margin-top: 20px;
  margin-bottom: 40px;
}

.second_page .main-header h1 span {
  color: #0d6e5f;
}

.second_page .main-header p {
  font-size: 2rem;
}

.second_page .sec_page_images {
  width: 100%;
  padding-top: 32px;
}

.second_page .card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  background: rgba(240, 250, 249);
  margin-bottom: 20px;
  border-radius: 10px;
}

.second_page .card h3 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.second_page .card .sec_page_images {
  height: 200px;
}

.second_page .card > .three_content {
  padding: 2rem;
}

.second_page .card:nth-child(even) .sec_page_images {
  order: 2;
}

@media (max-width: 780px) {
  .second_page .card {
    display: block;
    /* width: 300px; */
  }

  .second_page .container {
    padding: 0 10px;
    overflow: hidden;
  }
}
@media (max-width: 900px) {
  .second_page .card > .three_content {
    padding: 10px;
  }

  .second_page .sec_page_images {
    /* margin-top: 80px; */
    margin-left: 10px;
    margin-right: 10px;
  }
}

.third_page {
  background-image: url("../../../public/homepage/book-shop.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.third-header {
  position: relative;
  top: 0;
  padding: 30px 100px;
}

.third-header h1 {
  position: relative;
  color: #0d6e5f;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1px;
}

.third-header ul li {
  align-content: right;
  list-style: none;
  position: relative;
  text-align: left;
}

.third-header ul .features {
  width: 130px;
}

.third-header ul li h2 {
  color: #004036;
  font-weight: 700;
  background-color: rgba(183, 226, 225);
  border-radius: 5px;
  padding: 5px 10px;
  text-align: center;
  margin: 10px 0px;
}

.third-header ul li li {
  display: flex;
  color: black;
  font-size: 14px;
  padding: 10px;
  text-decoration: none;
}

.third-header ul li section {
  position: relative;
  background-color: rgba(240, 250, 249, 0.8);
  border-radius: 10px;
  font-weight: 600;
  width: 345px;
}

.third-header ul li section li {
  width: 345px;
  border-radius: 10px;
}

.third_page .container {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 70px 100px;
}

.third_page .container {
  position: relative;
  width: 100%;
  padding-bottom: 0px;
}

.third_page .container .card:last-child {
  margin-right: auto;
}

.third_page .container .card {
  position: relative;
  max-width: 250px;
  height: 190px;
  background: rgba(183, 226, 225, 0.6);
  margin: 30px 30px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 20px rgba(24, 134, 133, 0.3);
  transition: 0.3s ease-in-out;
  border-radius: 3px;
}

.third_page .container .card:hover {
  height: 280px;
}

.third_page .container .card .imgBox {
  position: relative;
  width: 150px;
  height: 260px;
  top: -60px;
  left: 6px;
  z-index: 1;
}

.third_page .container .card .imgBox img {
  max-width: 91%;
  border-radius: 4px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  opacity: 0.85;
}

@media (max-width: 520px) {
  .third-header {
    padding: 30px 0;
    padding-left: 10px;
  }

  .third-header ul li h2 {
    padding: 0;
    line-height: 3rem;
  }

  .third_page .container .card .imgBox img {
    max-width: 80%;
  }

  .fourth_page .fourth-header {
    padding: 30px 0;
    padding-left: 10px;
  }
}

.third_page .container .card .imgBox h2 {
  text-align: center;
  line-height: 2rem;
  font-weight: 700;
  font-size: 18px;
}

.third_page .container .card .content {
  position: relative;
  margin-top: -130px;
  padding: 10px 15px;
  text-align: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s ease-in-out;
}

.third_page .container .card:hover img {
  opacity: 1;
}

.third_page .container .card:hover .content {
  visibility: visible;
  opacity: 1;
  margin-top: -30px;
  transition-delay: 0.3s;
}

.third_page .container .card .content a {
  color: #000;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 2px 15px;
  border-radius: 20px;
  transition: 0.4s;
  transition-property: background;
}

.third_page .container .card .content p {
  margin-bottom: 15px;
}

.third_page .container .card .content a:not(:last-child) {
  margin-right: 30px;
}

.third_page .container .card .content a:hover {
  background: #f0faf9;
}

.fourth_page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-image: url("../../../public/homepage/last_background.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

/* @media (max-width: 1500px) {
  .fourth_page {
    background: #fff;
  }
  
  .writer,
  .typing {
    opacity: 0;
  }
} */

.fourth-header {
  position: relative;
  top: 0;
  padding: 30px 100px;
}

.fourth-header h1 {
  position: relative;
  color: #0d6e5f;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1px;
}

.fourth-header ul li {
  align-content: right;
  list-style: none;
  position: relative;
  text-align: left;
}

.fourth-header ul .features {
  width: 130px;
}

.fourth-header ul li h2 {
  color: #004036;
  font-weight: 700;
  background-color: rgba(183, 226, 225);
  border-radius: 5px;
  padding: 5px 10px;
  text-align: center;
  margin: 10px 0px;
}

.fourth-header ul li li {
  display: flex;
  color: black;
  font-size: 14px;
  padding: 10px;
  text-decoration: none;
}

.fourth-header ul li section {
  position: relative;
  background-color: rgba(240, 250, 249, 0.8);
  border-radius: 10px;
  font-weight: 600;
  width: 440px;
}

.fourth-header ul li section li {
  width: 440px;
  border-radius: 10px;
}

.fourth_page .writer {
  color: #015347;
  position: absolute;
  left: 680px;
  top: 220px;
}

.fourth_page .typing {
  display: inline-flex;
  position: absolute;
  left: 680px;
  top: 280px;
}

.fourth_page .typing .static-txt {
  color: #0d6e5f;
  font-size: 16px;
  font-weight: 600;
}

.fourth_page .typing .dynamic-txts {
  margin-left: 6px;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
}

.fourth_page .typing .dynamic-txts li {
  color: rgb(100, 212, 209);
  list-style: none;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  top: 0;
  animation: slide 15s steps(5) infinite;
}

@keyframes slide {
  100% {
    top: -100px;
  }
}

.fourth_page .typing .dynamic-txts li span {
  position: relative;
}

.fourth_page .typing .dynamic-txts li span::after {
  content: "";
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  background: white;
  border-left: 2px solid rgb(100, 212, 209);
  animation: typing 3s steps(9) infinite;
}

@keyframes typing {
  100% {
    left: 100%;
    margin: 0 -40px 0 9px;
  }
}

footer {
  position: relative;
  width: 100%;
  height: auto;
  padding: 50px 100px 20px 100px;
  background: #147e6e;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

footer .container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
}

footer .container .sec {
  margin-right: 30px;
}

footer .container .sec.aboutus {
  width: 40%;
}
footer .container h2 {
  position: relative;
  color: #f0faf9;
  font-weight: 500;
  margin-bottom: 15px;
}
footer .container h2:before {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 2px;
  background: rgba(183, 226, 225, 0.95);
}
footer p {
  color: #dce9e8;
}
.sci {
  margin-top: 20px;
  display: flex;
}
.sci li {
  list-style: none;
}
.sci li a {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: #168877;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  text-decoration: none;
  border-radius: 4px;
}
.sci li a:hover {
  background: rgba(225, 248, 248, 0.95);
}
.sci li a .fab {
  color: rgb(41, 206, 200);
  font-size: 20px;
}
.quickLinks {
  position: relative;
  width: 25%;
}
.quickLinks ul li {
  list-style: none;
}
.quickLinks ul li a {
  color: #dce9e8;
  text-decoration: none;
  margin-bottom: 10px;
  display: inline-block;
}
.quickLinks ul li a:hover {
  color: rgba(101, 199, 199, 0.95);
}
.contact {
  width: calc(35% - 60px);
  margin-right: 0 !important;
}
.contact .Info {
  position: relative;
}
.contact .Info li {
  display: flex;
  margin-bottom: 16px;
}
.contact .Info li span:nth-child(1) {
  color: #ffffff;
  font-size: 20px;
  margin-right: 10px;
}
.contact .Info li span {
  color: #dce9e8;
}
.contact .Info li a {
  color: #dce9e8;
  text-decoration: none;
}
.contact .Info li a:hover {
  color: rgba(101, 199, 199, 0.95);
}
.copyrightText {
  width: 100%;
  background: #147e6e;
  padding: 30px 100px;
  text-align: center;
  color: #dce9e8;
}

@media (max-width: 991px) {
  footer {
    padding: 40px;
  }
  footer .container {
    flex-direction: column;
  }
  footer .container .sec {
    margin-right: 0;
    margin-bottom: 20px;
  }
  footer .container .sec.aboutus,
  .quickLinks,
  .contact {
    width: 100%;
  }
  .copyrightText {
    padding: 8px 40px;
  }
}

@media (max-width: 520px) {
  p {
    font-size: 14px;
  }
  h1 {
    font-size: 20px;
  }
  h2 {
    font-size: 16px;
  }
}

@media (max-width: 780px) {
  .writer {
    display: none !important;
  }

  .typing {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .main_page .content {
    margin: 10px;
    margin-top: 90px;
  }

  .fourth-header ul li h2 {
    padding: 0 !important;
    line-height: 3rem;
  }

  .intro-text .text {
    font-size: 3.5rem;
  }
}
</style>
