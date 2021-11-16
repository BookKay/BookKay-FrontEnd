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

  // let manuscriptClone = { ...state.manuscript };
  // console.log(manuscriptClone);
  // state.manuscript = manuscriptClone;
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
