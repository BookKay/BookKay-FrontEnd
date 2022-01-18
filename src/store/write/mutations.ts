import { WriteStateInterface } from './state';
import { Manuscript } from '../interfaces';

export function setManuscript(
  state: WriteStateInterface,
  manuscript: Manuscript
) {
  if (manuscript) {
    state.manuscript = manuscript;
  }
}

export function updateManuscript(
  state: WriteStateInterface,
  manuscript: Manuscript
) {
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

interface Prototype {
  [key: string]: any;
}

export function updatePrototype(
  state: WriteStateInterface,
  prototype: Prototype
) {
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
