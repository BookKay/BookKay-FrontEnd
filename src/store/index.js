import Vue from "vue";
import Vuex from "vuex";

import example from "./module-example";
import user from "./user";
import write from "./write";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

/*const modules = {
  example: example,
  user: user
};*/

//export default function(/* { ssrContext } */) {
/* const Store = new Vuex.Store({
    modules: {
      example: example,
      user: user
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  return Store;
}*/

/*for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`);
  }
}*/

const modules = {
  example,
  user,
  write
};

const store = new Vuex.Store({ modules });

// Automatically run the `init` action if available for every module.
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`);
  }
}

export default store;
