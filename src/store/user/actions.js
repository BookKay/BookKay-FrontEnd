import { api } from "boot/axios";
import { Cookies, LocalStorage, SessionStorage } from "quasar";

export function someAction(/* context */) {}

export function login({ commit }, user) {
  return new Promise((resolve, reject) => {
    commit("auth_request");

    api
      .post("login", user)
      .then(resp => {
        const accessToken = resp.data.access_token;
        const refreshToken = resp.data.refresh_token;
        const user = resp.data.user;
        const payload = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: user
        };

        Cookies.set("accessToken", accessToken, { expires: "60d" });
        Cookies.set("refreshToken", refreshToken, { expires: "60d" });
        LocalStorage.set("user", user);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        commit("auth_success", payload);

        resolve(resp);
      })
      .catch(err => {
        commit("auth_error");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        LocalStorage.remove("user");
        reject(err);
      });
  });
}

export function register({ commit }, user) {
  return new Promise((resolve, reject) => {
    commit("auth_request");
    api
      .post("users", user)
      .then(resp => {
        const accessToken = resp.data.access_token;
        const refreshToken = resp.data.refresh_token;
        const user = resp.data.user;
        const payload = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: user
        };

        Cookies.set("accessToken", accessToken, { expires: "60d" });
        Cookies.set("refreshToken", refreshToken, { expires: "60d" });
        LocalStorage.set("user", user);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        commit("auth_success", payload);

        resolve(resp);
      })
      .catch(err => {
        commit("auth_error");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        LocalStorage.remove("user");
        reject(err);
      });
  });
}

export function logout({ commit }) {
  return new Promise((resolve, reject) => {
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
    resolve();
  });
}

export function edit({ commit, state }, user) {
  return new Promise((resolve, reject) => {
    api
      .patch("users/" + state.user.id, user)
      .then(resp => {
        const user = resp.data;

        LocalStorage.set("user", user);

        commit("edit", user);

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function deleteUser({ commit, state }, user) {
  return new Promise((resolve, reject) => {
    api
      .delete("users/" + state.user.id, user)
      .then(resp => {
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
      .catch(err => {
        reject(err);
      });
  });
}

export function addManuscript({ commit }, manuscript) {
  return new Promise((resolve, reject) => {
    api
      .post("manuscripts", manuscript)
      .then(resp => {
        const user = resp.data.user;

        commit("setUser", user);
        localStorage.set("user", user);

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}
