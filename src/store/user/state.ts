import { LocalStorage, Cookies } from 'quasar';

import { User, EmptyUser } from '../interfaces';

export interface UserStateInterface {
  status: string;
  refreshToken: string;
  accessToken: string;
  user: User;
}

export default function (): UserStateInterface {
  return {
    status: '',
    refreshToken: Cookies.get('refreshToken'),
    accessToken: Cookies.get('accessToken'),
    user: LocalStorage.getItem('user') || EmptyUser,
  };
}
