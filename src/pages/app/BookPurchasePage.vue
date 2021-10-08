<template>
  <q-page>
    <div class="container">
      <div class="card">
        <div class="shoeBackground">
          <div class="gradients">
            <div class="gradient second" color="blue"></div>
            <div class="gradient" color="red"></div>
            <div class="gradient" color="green"></div>
            <div class="gradient" color="orange"></div>
            <div class="gradient" color="black"></div>
          </div>
          <h1 class="nike">BookKay</h1>
          <!-- <img src="img/logo.png" alt="" class="logo" /> -->
          <img
            :src="book.front_cover"
            alt="Background Image"
            class="background-img"
          />

          <q-btn icon="share" :ripple="{ early: true }" class="share" />

          <!-- <img src="img/blue.png" alt="" class="shoe show" color="blue" />
          <img src="img/red.png" alt="" class="shoe" color="red" />
          <img src="img/green.png" alt="" class="shoe" color="green" />
          <img src="img/orange.png" alt="" class="shoe" color="orange" />
          <img src="img/black.png" alt="" class="shoe" color="black" /> -->
        </div>
        <div class="info">
          <div class="shoeName">
            <div>
              <h1 class="big ellipsis">{{ book.author_name }}</h1>
              <span class="new">new</span>
            </div>
            <h3 class="small ellipsis-2-lines">{{ book.title }}</h3>
          </div>
          <div class="description">
            <h3 class="title">Product Info</h3>
            <p class="text ellipsis-3-lines">
              {{ book.description }}
            </p>
          </div>
          <!-- <div class="color-container">
            <h3 class="title">Color</h3>
            <div class="colors">
              <span class="color active" primary="#2175f5" color="blue"></span>
              <span class="color" primary="#f84848" color="red"></span>
              <span class="color" primary="#29b864" color="green"></span>
              <span class="color" primary="#ff5521" color="orange"></span>
              <span class="color" primary="#444" color="black"></span>
            </div>
          </div>
          <div class="size-container">
            <h3 class="title">size</h3>
            <div class="sizes">
              <span class="size">7</span>
              <span class="size">8</span>
              <span class="size active">9</span>
              <span class="size">10</span>
              <span class="size">11</span>
            </div>
          </div> -->
          <div class="buy-price">
            <q-btn
              icon="shopping_cart"
              label="Let's Buy"
              :ripple="{ early: true }"
              class="buy"
            />
            <div class="price">
              <i class="fas fa-dollar-sign"></i>
              <h1>{{ book.price == 0.0 ? "Free" : book.price }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "BookPurchasePage",
  beforeMount() {
    this.$api.get("books/" + this.$route.params.book_id).then((resp) => {
      const book = resp.data;

      this.book = book;
    });
  },
  data() {
    return {
      book: {
        title: "Best Book LOL hohoo a very lonnnnnnnnnngggg title",
        author_name: "Kevin",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris velit lacus, ultricies et tempus sit amet, pharetra eu dolor. Quisque in dui ligula. Nulla scelerisque ut nisl sed lacinia. Curabitur sit amet erat diam. Fusce luctus imperdiet velit ut efficitur. Suspendisse placerat efficitur finibus. Donec imperdiet molestie massa sit amet venenatis. Mauris tempor commodo finibus.",
        id: "1111",
        price: 0,
        front_cover:
          "https://res.cloudinary.com/bookkay/image/upload/v1625766495/BookKay/Front%20Cover/front_cover_da876a3a-e012-11eb-a5b9-ba6b82820b1a.png",
      },
    };
  },
  methods: {
    purchase() {
      const purchase = {
        book_id: this.book.id,
        user_id: this.$store.getters["user/userProperty"]("id"),
      };

      this.$api
        .post("book_purchases", purchase)
        .then((resp) => {
          const user = resp.data;
          this.$store.commit("user/setUser", user);
          this.$q.localStorage.set("user", user);

          this.$q.notify({
            color: "positive",
            position: "top",
            message: `You have successfully bought ${this.book.title}. Hope you enjoy it.`,
            icon: "error",
          });

          this.$router.replace({
            name: "app-read",
          });
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message || "Something went wrong",
            icon: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
  --primary: #2175f5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #efefef;
}

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 860px;
}

.shoeBackground {
  position: relative;
  width: 50%;
  height: 475px;
  box-shadow: -15px 0 35px rgba(0, 0, 0, 0.1), 0 -15px 35px rgba(0, 0, 0, 0.1),
    0 15px 35px rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.background-img {
  width: 100%;
  height: 475px;
  object-fit: cover;
}

.gradients {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -2;
}

.first {
  z-index: 0;
  animation: 1s width ease;
}

@keyframes width {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.second {
  z-index: -1;
}

.gradient[color="blue"] {
  background-image: linear-gradient(45deg, #0136af, #22abfa);
}

.gradient[color="red"] {
  background-image: linear-gradient(45deg, #d62926, #ee625f);
}

.gradient[color="green"] {
  background-image: linear-gradient(45deg, #11998e, #1ce669);
}

.gradient[color="orange"] {
  background-image: linear-gradient(45deg, #fc4a1a, #f7b733);
}

.gradient[color="black"] {
  background-image: linear-gradient(45deg, #111, #666);
}

.logo {
  position: absolute;
  width: 100px;
  left: 20px;
  top: 20px;
}

.share {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  font-size: 1.3rem;
  text-decoration: none;
  color: var(--primary);
  transition: 0.5s;
}

.share:hover {
  transform: scale(1.1);
}

.share i {
  line-height: 50px;
}

.nike {
  position: absolute;
  top: 85px;
  left: 15px;
  font-size: 11rem;
  text-transform: uppercase;
  line-height: 0.9;
  color: #fff;
  opacity: 0.1;
}

.shoe {
  position: absolute;
  width: 140%;
  opacity: 0;
  bottom: 0;
  right: 0;
  transform: rotate(-20deg);
  transition: 0.5s;
}

.shoe.show {
  opacity: 1;
}

.info {
  width: 50%;
  background-color: #fff;
  z-index: 1;
  padding: 35px 40px;
  box-shadow: 15px 0 35px rgba(0, 0, 0, 0.1), 0 -15px 35px rgba(0, 0, 0, 0.1),
    0 15px 35px rgba(0, 0, 0, 0.1);
}

.shoeName {
  padding: 0 0 10px 0;
}

.shoeName div {
  display: flex;
  align-items: center;
}

.shoeName div .big {
  margin-right: 10px;
  font-size: 2rem;
  color: #333;
  line-height: 1;
}

.shoeName div .new {
  background-color: var(--primary);
  text-transform: uppercase;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
  transition: 0.5s;
}

.shoeName .small {
  font-weight: 500;
  color: #444;
  margin-top: 3px;
  text-transform: capitalize;
}

.shoeName,
.description,
.color-container,
.size-container {
  border-bottom: 1px solid #dadada;
}

.description {
  padding: 10px 0;
}

.title {
  color: #3a3a3a;
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.text {
  color: #555;
  font-size: 17px;
}

.color-container {
  padding: 10px 0;
}

.colors {
  padding: 8px 0;
  display: flex;
  align-items: center;
}

.color {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin: 0 10px;
  border: 5px solid;
  cursor: pointer;
  transition: 0.5s;
}

.color[color="blue"] {
  background-color: #2175f5;
  border-color: #2175f5;
}

.color[color="red"] {
  background-color: #f84848;
  border-color: #f84848;
}

.color[color="green"] {
  background-color: #29b864;
  border-color: #29b864;
}

.color[color="orange"] {
  background-color: #ff5521;
  border-color: #ff5521;
}

.color[color="black"] {
  background-color: #444;
  border-color: #444;
}

.color.active {
  border-color: #fff;
  box-shadow: 0 0 10px 0.5px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.size-container {
  padding: 10px 0;
  margin-bottom: 10px;
}

.sizes {
  padding: 8px 0;
  display: flex;
  align-items: center;
}

.size {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: #eee;
  margin: 0 10px;
  text-align: center;
  line-height: 40px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.size.active {
  background-color: var(--primary);
  color: #fff;
  transition: 0.5s;
}

.buy-price {
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #333;
  display: flex;
  align-items: flex-start;
}

.price h1 {
  font-size: 2.1rem;
  font-weight: 600;
  line-height: 1;
}

.price i {
  font-size: 1.4rem;
  margin-right: 1px;
}

.buy {
  padding: 0.7rem 1rem;
  //background-color: var(--primary);
  text-decoration: none;
  //color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: 0.5s;
}

.buy:hover {
  transform: scale(1.1);
}

.buy i {
  margin-right: 2px;
}

@media (max-width: 1070px) {
  .shoe {
    width: 135%;
  }
}

@media (max-width: 1000px) {
  .card {
    flex-direction: column;
    width: 100%;
    box-shadow: 0 0 35px 1px rgba(0, 0, 0, 0.2);
  }

  .card > div {
    width: 100%;
    box-shadow: none;
  }

  .shoe {
    width: 100%;
    transform: rotate(-5deg) translateY(-50%);
    top: 55%;
    right: 2%;
  }

  .nike {
    top: 20%;
    left: 5%;
  }
}

@media (max-width: 600px) {
  .share {
    width: 40px;
    height: 40px;
  }

  .share i {
    font-size: 1rem;
    line-height: 40px;
  }

  .logo {
    width: 70px;
  }
}

@media (max-width: 490px) {
  .nike {
    font-size: 7rem;
  }

  .shoeName div .big {
    font-size: 1.3rem;
  }

  .small {
    font-size: 1rem;
    line-height: 2rem;
  }

  .new {
    padding: 2px 6px;
    font-size: 0.9rem;
  }

  .title {
    font-size: 0.9rem;
  }

  .text {
    font-size: 0.8rem;
  }

  .buy {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .price h1 {
    font-size: 1.5rem;
  }

  .price i {
    font-size: 0.9rem;
  }

  .size {
    width: 30px;
    height: 30px;
    margin: 0 8px;
    font-size: 0.9rem;
    line-height: 30px;
  }

  .color {
    margin: 0 6px;
    width: 0 20px;
    width: 20px;
    height: 20px;
    border-width: 4px;
  }

  .share {
    width: 35px;
    height: 35px;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    line-height: 35px;
  }

  .share i {
    font-size: 0.8rem;
    line-height: 35px;
  }

  .logo {
    width: 60px;
    top: 10px;
    left: 10px;
  }

  .info {
    padding: 20px;
  }
}

@media (max-width: 400px) {
  .buy i {
    display: none;
  }

  .container {
    padding: 20px;
  }
}
</style>
