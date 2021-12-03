import { api } from "boot/axios";
import { Cookies, LocalStorage, SessionStorage } from "quasar";

export function someAction(/* context */) {}

export async function addComponent({ commit, state }, payload) {
  let response;

  //Unpacking the paylaod and determining which component the request should be sent for
  const data = payload.component;
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
    "default-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" },
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
    "default-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" },
    }
  );
  state.loading = false;

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function editComponent({ commit, state }, payload) {
  const component = payload.component;
  const type = payload.type;
  const id = payload.id;

  let path = type.replaceAll("_", "-") + "s/" + id;

  //Send patch request for the component and retrieve back updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.patch(path, component);

  response = await api.get(
    "default-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" },
    }
  );
  state.loading = false;

  let prototype = response.data;
  commit("updatePrototype", prototype);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function deleteComponent({ commit, state }, payload) {
  const type = payload.type;
  const id = payload.id;
  let path = type + "s/" + id;

  //Delete the component and retrieve back updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.delete(path);
  response = await api.get(
    "default-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" },
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
  let configs_id = state.manuscript.configs.id;

  response = await api.patch(
    "default-book-prototypes-configs/" + configs_id,
    configs
  );
  response = await api.get(
    "default-book-prototypes/" + state.manuscript.prototype_id,
    {
      params: { expand: "~all" },
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
  let manuscript_response = response;

  payload = { manuscript_id: response.data.id, configs: manuscript.configs };

  //Attaching the prototype on the manuscript
  response = await api.post("default-book-prototypes", payload);

  let owner_id = response.data.component_owner_id;

  for (const front_matter of manuscript.front_matters) {
    front_matter.component_owner_id = owner_id;
    await api.post("front-matters", front_matter);
  }

  for (const chapter of manuscript.chapters) {
    chapter.component_owner_id = owner_id;
    await api.post("chapters", chapter);
  }

  for (const back_matter of manuscript.back_matters) {
    back_matter.component_owner_id = owner_id;
    await api.post("back-matters", back_matter);
  }

  //Requesting updated user
  response = await api.get("users/" + rootGetters["user/userProperty"]("id"), {
    params: { expand: "~all" },
  });

  let user = response.data;

  //Saving the user
  commit("user/setUser", user, { root: true });
  LocalStorage.set("user", user);

  return manuscript_response;
}

export async function editManuscript({ commit, state }, manuscript) {
  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.patch("manuscripts/" + state.manuscript.id, manuscript);
  response = await api.get("manuscripts/" + state.manuscript.id, {
    params: { expand: "~all" },
  });

  let data = response.data;
  commit("updateManuscript", data);

  SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export async function editPrototype({ commit, state }, payload) {
  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;
  let prototype = payload["prototype"];
  let manuscript_id = payload["manuscript_id"];

  //Getting prototype id
  response = await api.get("manuscripts/" + manuscript_id, {
    params: { fields: "prototype_id" },
  });
  let prototype_id = response.data.prototype_id;

  //Patching the prototype
  response = await api.patch(
    "default-book-prototypes/" + prototype_id,
    prototype
  );

  // response = await this.$api.get("default-book-prototypes/" + prototype_id, {
  //   params: { expand: "~all" },
  // });

  // commit("updatePrototype", response.data);

  // SessionStorage.set("currentManuscript", state.manuscript);

  return response;
}

export function uploadMedia({ commit, state }, formData) {
  state.loading = true;

  return new Promise((resolve, reject) => {
    api
      .post("upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        state.loading = false;

        resolve(resp);
      })
      .catch((err) => {
        state.loading = false;
        reject(err);
      });
  });
}

export async function publishBook({ commit, state }) {
  //Update the configs and retrieve back the updated prototype
  //Then, update the prototype from vuex and session storage
  let response;

  response = await api.post(`manuscripts/${state.manuscript.id}/publish`);
  response = await api.get(`users/${LocalStorage.getItem("user").id}`, {
    params: { expand: "~all" },
  });

  let user = response.data;
  commit("users/setUser", user, { root: true });

  LocalStorage.set("user", user);

  return response;
}
