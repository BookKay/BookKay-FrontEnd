import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { useRoute, LocationQueryValue } from 'vue-router';
import { Cookies } from 'quasar';
import { useStore } from 'vuex';

export default function handleRequests() {
  const route = useRoute();
  const store = useStore();

  const fetchManuscript = async () => {
    //Fetching the manuscript
    let response: AxiosResponse;
    let manuscript;

    try {
      response = await api.get(
        'manuscripts/' + route.query.manuscript_id + '/blocks'
      );

      manuscript = response.data;
    } catch (err) {
      console.log(err);
    }

    return manuscript;
  };

  const fetchBook = async () => {
    let response: AxiosResponse;
    const book_id = route.query.book_id;

    await updateReadHistory(book_id);

    try {
      response = await api.get('books/' + book_id + '/blocks');
      const book = response.data;

      return book;
    } catch (err) {
      console.log(err);
    }
  };

  const updateReadHistory = async (
    book_id: LocationQueryValue | LocationQueryValue[]
  ) => {
    let response: AxiosResponse;

    //Updating the server for the read
    if (!Cookies.has(`last_read_${book_id}`)) {
      if (store.getters['user/isLoggedIn']) {
        response = await api.post(`books/${book_id}/read`);
      } else {
        response = await api.get(`books/${book_id}/read`);
      }

      //Setting cookies to prevent recalling
      Cookies.set(`last_read_${book_id}`, '', {
        expires: '1h',
        path: '/',
      });
    }
  };

  return { fetchManuscript, fetchBook };
}
