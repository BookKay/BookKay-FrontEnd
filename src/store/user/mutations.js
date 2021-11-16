export function someMutation(/* state */) {}

export function auth_request(state) {
  state.status = "loading";
}

export function auth_success(state, payload) {
  state.status = "success";
  state.accessToken = payload["accessToken"];
  state.refreshToken = payload["refreshToken"];
  state.user = payload["user"];
}

export function auth_error(state) {
  state.status = "error";
}

export function setUser(state, user) {
  if (user) {
    let newUser = user;

    let books = newUser.books_authored;
    for (var i = 0; i < books.length; i++) {
      let book = books[i];
      book.author = {};
      book.author.author_name = user.author_name;
    }

    state.user = { ...state.user, ...newUser };
  }
}

export function logout(state) {
  state.status = "";
  state.user = "";
  state.accessToken = "";
  state.refreshToken = "";
}
