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

export function setManuscript(state, manuscript) {
  if (manuscript) {
    state.manuscript = manuscript;
  }
}

export function updateManuscript(state, manuscript) {
  //Updating only the manuscript values
  if (manuscript) {
    for (const key in manuscript) {
      state.manuscript[key] = manuscript[key];
    }
  }
}

export function updatePrototype(state, prototype) {
  //Updating only the prototype values
  if (prototype) {
    for (const key in prototype) {
      if (`prototype_${key}` in state.manuscript) {
        state.manuscript[`prototype_${key}`] = prototype[key];
      } else {
        state.manuscript[key] = prototype[key];
      }
    }
  }
}

export const edit = (state, user) => {
  if (user) {
    state.user = user;
  }
};


