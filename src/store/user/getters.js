export function someGetter(/* state */) {}

export function isLoggedIn(state) {
  return !!state.refreshToken && !!state.user;
}

export function authStatus(state) {
  return state.status;
}

export const userProperty = state => key => {
  if (key in state.user) {
    return state.user[key];
  } else {
    return "";
  }
};
