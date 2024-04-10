export const getData = event => {
  const searchInputValue = event.srcElement.elements.search_input.value;
  const options = {
    key: '43212506-95870309335e8ebf3ea9c8656',
    q: searchInputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 9,
  };

  const searchParams = new URLSearchParams(options).toString();
  const url = `https://pixabay.com/api/?${searchParams}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
