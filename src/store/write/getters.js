export function someGetter(/* state */) {}

export function isLoading(state) {
  return state.loading;
}

export function getConfigs(state) {
  //Getting active configs
  let activeConfigs = [];

  const configs = Object.keys(state.manuscript.configs);
  for (var i = 0; i < configs.length; i++) {
    let config = configs[i];
    if (state.manuscript.configs[config] == true) {
      activeConfigs.push(config);
    }
  }

  return activeConfigs;
}

export const manuscriptProperty = state => key => {
  if (key in state.manuscript) {
    return state.manuscript[key];
  } else {
    return "";
  }
};
