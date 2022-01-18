export interface User {
  username: string;
  email: string;
  author_name: string;
  biography: string;
  date_joined: string;
  id: string;
  url?: string;
  books_authored: Book[];
  book_purchased: Book[];
  [key: string]: any;
}

export const EmptyUser: User = {
  username: '',
  email: '',
  author_name: '',
  biography: '',
  date_joined: '',
  id: '',
  books_authored: [],
  book_purchased: [],
};

export interface Genre {
  name: string;
  description?: string;
  [key: string]: any;
}

export const EmptyGenre = {
  name: '',
  description: '',
};

export interface Book {
  title: string;
  description: string;
  author?: User;
  author_name?: string;
  front_cover: string;
  back_cover: string;
  genre: Genre;
  id: string;
  price: number;
  publish_date: string;
  slug_title: string;
  purchased_users?: User[];
  [key: string]: any;
}

export interface Manuscript {
  title: string;
  description: string;
  author?: User;
  author_name?: string;
  front_cover: string;
  back_cover: string;
  temp_cover: string;
  last_edited: string;
  genre: Genre;
  id: string;
  price: number;
  published: boolean;
  created_date: string;
  slug_title: string;
  purchased_users?: User[];
  [key: string]: any;
}

export const EmptyManuscript = {
  title: '',
  description: '',

  author_name: '',
  front_cover: '',
  back_cover: '',
  temp_cover: '',
  last_edited: '',
  genre: EmptyGenre,
  id: '',
  price: 0.0,
  published: false,
  created_date: '',
  slug_title: '',
  purchased_users: [],
};
