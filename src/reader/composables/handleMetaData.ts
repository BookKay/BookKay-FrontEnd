import { useMeta } from 'quasar';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';

export default function handleMetaData() {
  const route = useRoute();

  const updateMetaData = async (title: string, description: string) => {
    //Fetching back the updated user
    const response = await api.get('books/' + route.query.book_id, {
      params: { fields: 'author_name' },
    });

    const author_name = response.data.author_name;

    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: `${title} | BookKay`,
        meta: {
          description: {
            name: 'description',
            content: description,
          },
          keywords: {
            name: 'keywords',
            content: `${title}, ${author_name}, BookKay, ebook`,
          },
          author: { name: 'author', content: author_name },
        },
      };
    });
  };

  return { updateMetaData };
}
