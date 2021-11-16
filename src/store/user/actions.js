import { api } from "boot/axios";
import { Cookies, LocalStorage, SessionStorage } from "quasar";

export async function login({ commit }, user) {
  let response;
  let payload;

  // Getting the user object

  response = await api.post("users/login", user);

  let returnedUser = response.data;
  payload = { user: returnedUser };

  //Requesting access + refresh token for the newly created user
  response = await api.post("token", user);

  let accessToken = response.data.access;
  let refreshToken = response.data.refresh;

  payload.accessToken = accessToken;
  payload.refreshToken = refreshToken;

  Cookies.set("accessToken", accessToken, { expires: "60d", path: "/" });
  Cookies.set("refreshToken", refreshToken, { expires: "60d", path: "/" });
  LocalStorage.set("user", returnedUser);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  commit("auth_success", payload);

  return response;
}

export async function register({ commit }, user) {
  let response;
  let payload;

  //Adding new user
  response = await api.post("users", user);
  payload = {
    user: response.data,
  };
  let returnedUser = response.data;

  //Requesting access + refresh token for the newly created user
  response = await api.post("token", user);

  let accessToken = response.data.access;
  let refreshToken = response.data.refresh;

  payload.accessToken = accessToken;
  payload.refreshToken = refreshToken;

  Cookies.set("accessToken", accessToken, { expires: "60d", path: "/" });
  Cookies.set("refreshToken", refreshToken, { expires: "60d", path: "/" });
  LocalStorage.set("user", returnedUser);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  commit("auth_success", payload);

  return response;
}

export async function logout({ commit }, payload) {
  let response;
  let id = payload["id"];

  //Adding new user
  response = await api.post(`users/${id}/logout`);
  commit("logout");
  for (const key in Cookies.getAll()) {
    Cookies.remove(key);
  }
  for (const key in LocalStorage.getAll()) {
    LocalStorage.remove(key);
  }
  for (const key in SessionStorage.getAll()) {
    SessionStorage.remove(key);
  }

  delete api.defaults.headers.common["Authorization"];
  return "";
}

export function edit({ commit, state }, user) {
  return new Promise((resolve, reject) => {
    api
      .patch("users/" + state.user.id, user)
      .then((resp) => {
        const user = resp.data;

        LocalStorage.set("user", user);

        commit("setUser", user);

        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function deleteUser({ commit, state }, user) {
  return new Promise((resolve, reject) => {
    api
      .delete("users/" + state.user.id, user)
      .then((resp) => {
        commit("logout");
        for (const key in Cookies.getAll()) {
          Cookies.remove(key);
        }
        for (const key in LocalStorage.getAll()) {
          LocalStorage.remove(key);
        }
        for (const key in SessionStorage.getAll()) {
          SessionStorage.remove(key);
        }

        delete api.defaults.headers.common["Authorization"];

        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function fetchUser({ commit, state }) {
  let res = await api.get("users/" + state.user.id, {
    params: { expand: "~all" },
  });
  let user = res.data;

  LocalStorage.set("user", user);
  commit("setUser", user);
}
