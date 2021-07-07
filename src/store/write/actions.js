import { api } from "boot/axios";
import { Cookies, LocalStorage, SessionStorage } from "quasar";

export function someAction(/* context */) {}

export function addChapter({ commit, state }, payload) {
  const data = payload.chapter;
  const type = payload.type;
  const isBook = payload.isBook;

  let path = "";

  switch (type) {
    case "Front Matter":
      path = "front_matters";
      break;
    case "Chapter":
      path = "chapters";
      break;
    case "Back Matter":
      path = "back_matters";
      break;
    default:
      path = type;
    // code block
  }

  return new Promise((resolve, reject) => {
    api
      .post(path, data)
      .then(resp => {
        if (!isBook) {
          const manuscript = resp.data.manuscript;

          SessionStorage.set("currentManuscript", manuscript);

          commit("setManuscript", manuscript);
        }

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getChapter({ commit, state }, payload) {
  const type = payload.type;
  const id = payload.id;

  let path = type.replace("-", "_") + "s/" + id;
  state.loading = true;

  return new Promise((resolve, reject) => {
    api
      .get(path)
      .then(resp => {
        state.loading = false;
        const manuscript = resp.data.manuscript;

        SessionStorage.set("currentManuscript", manuscript);

        commit("setManuscript", manuscript);

        resolve(resp);
      })
      .catch(err => {
        state.loading = false;
        reject(err);
      });
  });
}

export function editChapter({ commit, state }, payload) {
  const chapter = payload.chapter;
  const type = payload.type;
  const id = payload.id;

  let path = type.replace("-", "_") + "s/" + id;
  state.loading = true;

  return new Promise((resolve, reject) => {
    api
      .patch(path, chapter)
      .then(resp => {
        console.log("resp", resp);
        state.loading = false;
        const manuscript = resp.data.manuscript;

        SessionStorage.set("currentManuscript", manuscript);

        commit("setManuscript", manuscript);

        resolve(resp);
      })
      .catch(err => {
        state.loading = false;
        reject(err);
      });
  });
}

export function deleteChapter({ commit, state }, payload) {
  const type = payload.type;
  const id = payload.id;
  let path = type.replace("-", "_") + "s/" + id;

  return new Promise((resolve, reject) => {
    api
      .delete(path)
      .then(resp => {
        console.log(resp);
        const manuscript = resp.data;
        SessionStorage.set("currentManuscript", manuscript);

        commit("setManuscript", manuscript);

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function editConfigs({ commit, state }, configs) {
  return new Promise((resolve, reject) => {
    api
      .patch("book_configs/" + configs.id, configs)
      .then(resp => {
        const manuscript = resp.data;

        SessionStorage.set("currentManuscript", manuscript);

        commit("setManuscript", manuscript);

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

        commit("user/setUser", user, { root: true });
        LocalStorage.set("user", user);

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function editManuscript({ commit, state }, manuscript) {
  state.loading = true;
  return new Promise((resolve, reject) => {
    api
      .patch("manuscripts/" + state.manuscript.id, manuscript)
      .then(resp => {
        const manuscript = resp.data;

        SessionStorage.set("currentManuscript", manuscript);

        commit("setManuscript", manuscript);

        state.loading = false;
        resolve(resp);
      })
      .catch(err => {
        state.loading = false;
        reject(err);
      });
  });
}

export function uploadMedia({ commit, state }, formData) {
  state.loading = true;
  console.log("formdata", formData);

  return new Promise((resolve, reject) => {
    api
      .post("upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(resp => {
        console.log("res", resp);

        state.loading = false;

        resolve(resp);
      })
      .catch(err => {
        state.loading = false;
        reject(err);
      });
  });
}

export function publishBook({ commit }, book) {
  return new Promise((resolve, reject) => {
    api
      .post("books", book)
      .then(resp => {
        const user = resp.data.user;

        commit("user/setUser", user, { root: true });
        LocalStorage.set("user", user);

        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}
