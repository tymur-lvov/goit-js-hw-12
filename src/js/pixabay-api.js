import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com';

export const getData = async (searchQuery, currentPage) => {
  const response = await axios.get('/api', {
    params: {
      key: '43212506-95870309335e8ebf3ea9c8656',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: 15,
    },
  });

  return response;
};
