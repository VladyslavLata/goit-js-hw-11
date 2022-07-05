import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';

export async function fetchQuery(searchQuery, page) {
  
  const params = {
    params: {
      key: '28341788-9e42159be3be8e53d709707ca',
      q: `${searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${page}`,
      per_page: 40,
    },
  };
  return await axios.get('/api', params).then(respons => respons.data);
}