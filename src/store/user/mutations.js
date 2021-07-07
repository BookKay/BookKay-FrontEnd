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
    state.user = user;
  }
}

export function logout(state) {
  state.status = "";
  state.user = "";
  state.accessToken = "";
  state.refreshToken = "";
}

export const edit = (state, user) => {
  if (user) {
    state.user = user;
  }
};
