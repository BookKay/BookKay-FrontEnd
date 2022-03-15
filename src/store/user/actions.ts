import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';
import { api } from 'boot/axios';
import { Cookies, LocalStorage, SessionStorage } from 'quasar';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async login({ commit }, user) {
    let response;

    // Getting the user object

    response = await api.post('users/login', user);

    const returnedUser = response.data;
    const payload = { user: returnedUser, accessToken: '', refreshToken: '' };

    //Requesting access + refresh token for the newly created user
    response = await api.post('token', user);

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    Cookies.set('accessToken', accessToken, { expires: '60d', path: '/' });
    Cookies.set('refreshToken', refreshToken, { expires: '60d', path: '/' });
    LocalStorage.set('user', returnedUser);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    commit('auth_success', payload);

    return response;
  },

  async register({ commit }, user) {
    let response;

    //Adding new user
    response = await api.post('users', user);
    const payload = {
      user: response.data,
      accessToken: '',
      refreshToken: '',
    };
    const returnedUser = response.data;

    //Requesting access + refresh token for the newly created user
    response = await api.post('token', user);

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    Cookies.set('accessToken', accessToken, { expires: '60d', path: '/' });
    Cookies.set('refreshToken', refreshToken, { expires: '60d', path: '/' });
    LocalStorage.set('user', returnedUser);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    commit('auth_success', payload);

    return response;
  },

  async logout({ commit }, payload) {
    const id = payload['id'];

    //Adding new user
    await api.post(`users/${id}/logout`);
    commit('logout');
    for (const key in Cookies.getAll()) {
      Cookies.remove(key);
    }
    for (const key in LocalStorage.getAll()) {
      LocalStorage.remove(key);
    }
    for (const key in SessionStorage.getAll()) {
      SessionStorage.remove(key);
    }

    delete api.defaults.headers.common['Authorization'];
    return '';
  },

  syncLogout({ commit }) {
    commit('logout');
    for (const key in Cookies.getAll()) {
      Cookies.remove(key);
    }
    for (const key in LocalStorage.getAll()) {
      LocalStorage.remove(key);
    }
    for (const key in SessionStorage.getAll()) {
      SessionStorage.remove(key);
    }

    return '';
  },

  async edit({ commit, state }, user) {
    const response = await api.patch('users/' + state.user.id, user, {
      params: { expand: '~all' },
    });
    user = response.data;

    LocalStorage.set('user', user);
    commit('setUser', user);
  },

  deleteUser({ commit, state }, user) {
    return new Promise((resolve, reject) => {
      api
        .delete('users/' + state.user.id, user)
        .then((resp) => {
          commit('logout');
          for (const key in Cookies.getAll()) {
            Cookies.remove(key);
          }
          for (const key in LocalStorage.getAll()) {
            LocalStorage.remove(key);
          }
          for (const key in SessionStorage.getAll()) {
            SessionStorage.remove(key);
          }

          delete api.defaults.headers.common['Authorization'];

          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async fetchUser({ commit, state }) {
    const res = await api.get('users/' + state.user.id, {
      params: { expand: '~all' },
    });
    const user = res.data;

    LocalStorage.set('user', user);
    commit('setUser', user);
  },
};

export default actions;
