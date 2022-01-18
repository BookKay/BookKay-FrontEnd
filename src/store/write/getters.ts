import { WriteStateInterface } from './state';

export function isLoading(state: WriteStateInterface) {
  return state.loading;
}

export function getConfigs(state: WriteStateInterface) {
  //Getting active configs
  const activeConfigs = [];

  if (state.manuscript) {
    const configs = Object.keys(state.manuscript.configs);

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      if (state.manuscript && state.manuscript.configs[config] == true) {
        activeConfigs.push(config);
      }
    }

    return activeConfigs;
  }
}

export const manuscriptProperty =
  (state: WriteStateInterface) => (key: string) => {
    //Checking if manuscript exist to allow quiet failing
    if (state.manuscript) {
      if (key in state.manuscript) {
        return state.manuscript[key];
      } else {
        return '';
      }
    }
  };
