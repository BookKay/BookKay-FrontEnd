import { UserStateInterface } from './state';
import { User, EmptyUser } from '../interfaces';

export interface PayloadInterface {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function auth_request(state: UserStateInterface) {
  state.status = 'loading';
}

export function auth_success(
  state: UserStateInterface,
  payload: PayloadInterface
) {
  state.status = 'success';
  state.accessToken = payload['accessToken'];
  state.refreshToken = payload['refreshToken'];
  state.user = payload['user'];
}

export function auth_error(state: UserStateInterface) {
  state.status = 'error';
}

export function setUser(state: UserStateInterface, user: User) {
  if (user) {
    const newUser = user;

    const books = newUser.books_authored;
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      //book.author = {};
      book.author = {} as any;
      if (book.author != undefined) {
        book.author.author_name = user.author_name;
      }
    }

    state.user = { ...state.user, ...newUser };
  }
}

export function logout(state: UserStateInterface) {
  state.status = '';
  state.user = EmptyUser;
  state.accessToken = '';
  state.refreshToken = '';
}
