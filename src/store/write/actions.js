import { api } from "boot/axios";
import { Cookies, LocalStorage, SessionStorage } from "quasar";

export function someAction(/* context */) {}

export async function addChapter({ commit, state }, payload) {
  let response;

  //Unpacking the paylaod and determining which component the request should be sent for
  const data = payload.chapter;
  const type = payload.type;
  const isBook = payload.isBook;

  let path = "";

  switch (type) {
    case "Front Matter":
      path = "front-matters";
      break;
    case "Chapter":
      path = "chapters";
      break;
    case "Back Matter":
      path = "back-matters";
      break;
    default:
      path = type;
  }

  //Adding new component and requesting back the new prototype
  response = await api.post(path, data);
  response = await api.get(
    "basic-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" }
    }
  );

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function getChapter({ commit, state }, payload) {
  //Unpack the payload to form the request path
  const type = payload.type;
  const id = payload.id;

  let path = type.replaceAll("_", "-") + "s/" + id;
  state.loading = true;

  //Request for the component + the prototype and update accordingly
  let response;

  response = await api.get(path);
  response = await api.get(
    "basic-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" }
    }
  );
  state.loading = false;

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function editChapter({ commit, state }, payload) {
  const component = payload.chapter;
  const type = payload.type;
  const id = payload.id;

  let path = type.replaceAll("_", "-") + "s/" + id;
  state.loading = true;

  //Send patch request for the component and retrieve back updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.patch(path, component);
  response = await api.get(
    "basic-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" }
    }
  );
  state.loading = false;

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function deleteChapter({ commit, state }, payload) {
  const type = payload.type;
  const id = payload.id;
  let path = type + "s/" + id;

  //Delete the component and retrieve back updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.delete(path);
  response = await api.get(
    "basic-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" }
    }
  );

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function editConfigs({ commit, state }, configs) {
  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.patch(
    "basic-book-prototypes-configs/" + configs.id,
    configs
  );
  response = await api.get(
    "basic-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" }
    }
  );

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function addManuscript({ commit, rootGetters }, manuscript) {
  let response;
  let payload;

  //Adding new manuscript
  response = await api.post("manuscripts", manuscript);

  payload = { manuscript_id: response.data.id, configs: manuscript.configs };

  //Attaching the prototype on the manuscript
  response = await api.post("basic-book-prototypes", payload);

  //Requesting updated user
  response = await api.get("users/" + rootGetters["user/userProperty"]("id"), {
    params: { expand: "~all" }
  });

  let user = response.data;

  //Saving the user
  commit("user/setUser", user, { root: true });
  LocalStorage.set("user", user);

  return response;
}

export async function editManuscript({ commit, state }, manuscript) {
  state.loading = true;

  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.patch("manuscripts/" + state.manuscript.id, manuscript);
  response = await api.get("manuscripts/" + state.manuscript.id, {
    params: { expand: "~all" }
  });
  state.loading = false;

  let data = response.data;
  console.log(data);
  commit("updateManuscript", data);
  console.log(state.manuscript);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
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

export async function publishBook({ commit, state }, manuscript) {
  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.post(`manuscripts/${state.manuscript.id}/publish`);
  response = await api.get(`users/${LocalStorage.getItem("user").id}`, {
    params: { expand: "~all" }
  });

  let user = response.data;
  commit("users/setUser", user, { root: true });

  LocalStorage.set("user", user);

  return response;
}
