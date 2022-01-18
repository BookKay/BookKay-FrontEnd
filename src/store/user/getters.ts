import { UserStateInterface } from './state';

export function isLoggedIn(state: UserStateInterface) {
  return !!state.refreshToken && !!state.user;
}

export function authStatus(state: UserStateInterface) {
  return state.status;
}

export const userProperty = (state: UserStateInterface) => (key: string) => {
  if (key in state.user) {
    return state.user[key];
  } else {
    return '';
  }
};
