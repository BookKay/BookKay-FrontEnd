import { api } from 'boot/axios';
import { LocalStorage, SessionStorage } from 'quasar';

import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { WriteStateInterface } from './state';
import { User, EmptyUser } from '../interfaces';

const actions: ActionTree<WriteStateInterface, StateInterface> = {
  async addComponent({ commit, state }, payload) {
    let response;

    //Unpacking the paylaod and determining which component the request should be sent for
    const data = payload.component;
    const type = payload.type;
    //const isBook = payload.isBook;

    let path = '';

    switch (type) {
      case 'Front Matter':
        path = 'front-matters';
        break;
      case 'Chapter':
        path = 'chapters';
        break;
      case 'Back Matter':
        path = 'back-matters';
        break;
      default:
        path = type;
    }

    //Adding new component and requesting back the new prototype
    response = await api.post(path, data);

    response = await api.get(
      'default-book-prototypes/' + state.manuscript.prototype_id,
      {
        params: { expand: '~all' },
      }
    );

    const prototype = response.data;
    commit('updatePrototype', prototype);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },
  async getChapter({ commit, state }, payload) {
    //Unpack the payload to form the request path
    const type = payload.type;
    const id = payload.id;

    const path = type.replaceAll('_', '-') + 's/' + id;
    state.loading = true;

    //Request for the component + the prototype and update accordingly
    let response;

    response = await api.get(path);
    response = await api.get(
      'default-book-prototypes/' + state.manuscript.prototype_id,
      {
        params: { expand: '~all' },
      }
    );
    state.loading = false;

    const prototype = response.data;
    commit('updatePrototype', prototype);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },

  async editComponent({ commit, state }, payload) {
    const component = payload.component;
    const type = payload.type;
    const id = payload.id;

    const path = type.replaceAll('_', '-') + 's/' + id;

    //Send patch request for the component and retrieve back updated prototype
    //Then, update the prototype from vuex and session storage
    let response;

    response = await api.patch(path, component);

    response = await api.get(
      'default-book-prototypes/' + state.manuscript.prototype_id,
      {
        params: { expand: '~all' },
      }
    );
    state.loading = false;

    const prototype = response.data;
    commit('updatePrototype', prototype);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },
  async deleteComponent({ commit, state }, payload) {
    const type = payload.type;
    const id = payload.id;
    const path = type + 's/' + id;

    //Delete the component and retrieve back updated prototype
    //Then, update the prototype from vuex and session storage
    let response;

    response = await api.delete(path);
    response = await api.get(
      'default-book-prototypes/' + state.manuscript.prototype_id,
      {
        params: { expand: '~all' },
      }
    );

    const prototype = response.data;
    commit('updatePrototype', prototype);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },
  async editConfigs({ commit, state }, configs) {
    //Update the configs and retrieve back the updated prototype
    //Then, update the prototype from vuex and session storage
    let response;
    const configs_id = state.manuscript.configs.id;

    response = await api.patch(
      'default-book-prototypes-configs/' + configs_id,
      configs
    );
    response = await api.get(
      'default-book-prototypes/' + state.manuscript.prototype_id,
      {
        params: { expand: '~all' },
      }
    );

    const prototype = response.data;
    commit('updatePrototype', prototype);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },
  async addManuscript({ commit, rootGetters }, manuscript) {
    let response;

    //Adding new manuscript
    response = await api.post('manuscripts', manuscript);
    const manuscript_response = response;

    const payload = {
      manuscript_id: response.data.id,
      configs: manuscript.configs,
    };

    //Attaching the prototype on the manuscript
    response = await api.post('default-book-prototypes', payload);

    const owner_id = response.data.component_owner_id;

    for (const front_matter of manuscript.front_matters) {
      front_matter.component_owner_id = owner_id;
      await api.post('front-matters', front_matter);
    }

    for (const chapter of manuscript.chapters) {
      chapter.component_owner_id = owner_id;
      await api.post('chapters', chapter);
    }

    for (const back_matter of manuscript.back_matters) {
      back_matter.component_owner_id = owner_id;
      await api.post('back-matters', back_matter);
    }

    //Requesting updated user
    response = await api.get(
      'users/' + rootGetters['user/userProperty']('id'),
      {
        params: { expand: '~all' },
      }
    );

    const user = response.data;

    //Saving the user
    commit('user/setUser', user, { root: true });
    LocalStorage.set('user', user);

    return manuscript_response;
  },
  async editManuscript({ commit, state }, manuscript) {
    //Update the configs and retrieve back the updated prototype
    //Then, update the prototype from vuex and session storage
    let response;

    response = await api.patch(
      'manuscripts/' + state.manuscript.id,
      manuscript
    );
    response = await api.get('manuscripts/' + state.manuscript.id, {
      params: { expand: '~all' },
    });

    const data = response.data;
    commit('updateManuscript', data);

    SessionStorage.set('currentManuscript', state.manuscript);

    return response;
  },
  async editPrototype({ commit, state }, payload) {
    //Update the configs and retrieve back the updated prototype
    //Then, update the prototype from vuex and session storage
    let response;
    const prototype = payload['prototype'];
    const manuscript_id = payload['manuscript_id'];

    //Getting prototype id
    response = await api.get('manuscripts/' + manuscript_id, {
      params: { fields: 'prototype_id' },
    });
    const prototype_id = response.data.prototype_id;

    //Patching the prototype
    response = await api.patch(
      'default-book-prototypes/' + prototype_id,
      prototype
    );

    // response = await this.$api.get("default-book-prototypes/" + prototype_id, {
    //   params: { expand: "~all" },
    // });

    // commit("updatePrototype", response.data);

    // SessionStorage.set("currentManuscript", state.manuscript);

    return response;
  },

  uploadMedia({ commit, state }, formData) {
    state.loading = true;

    return new Promise((resolve, reject) => {
      api
        .post('upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
  },
  async publishBook({ commit, state }) {
    //Update the configs and retrieve back the updated prototype
    //Then, update the prototype from vuex and session storage
    let response;

    response = await api.post(`manuscripts/${state.manuscript.id}/publish`);

    const userLocal = <User>LocalStorage.getItem('user') || EmptyUser;
    const user_id = userLocal.id;
    response = await api.get(`users/${user_id}`, {
      params: { expand: '~all' },
    });

    const user = response.data;
    commit('users/setUser', user, { root: true });

    LocalStorage.set('user', user);

    return response;
  },
};

export default actions;
