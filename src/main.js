import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import { getData } from './js/pixabay-api';
import { renderElements } from './js/render-functions';

const elements = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  loadButton: document.querySelector('.load-button'),
};

const messages = {
  noMatches() {
    iziToast.show({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      messageColor: '#fff',
      backgroundColor: '#EF4040',
      position: 'topRight',
    });
  },
  loadsLimit() {
    iziToast.show({
      message: 'We are sorry, but you have reached the end of search results.',
      messageColor: '#fff',
      backgroundColor: '#0099FF',
      position: 'topRight',
    });
  },
};

const options = {
  captionsData: 'alt',
  captionDelay: 250,
};
const imageModal = new SimpleLightbox('.gallery a', options);

let currentPage = null;
let searchInputValue = null;

const onSearchFormSubmit = async event => {
  event.preventDefault();

  currentPage = 1;

  elements.gallery.innerHTML = '';
  elements.loader.classList.add('is-visible');
  elements.loadButton.classList.remove('is-visible');

  searchInputValue = event.srcElement.elements.search_input.value;

  try {
    const response = await getData(searchInputValue, currentPage);
    const { data } = response;

    if (data.hits.length === 0) {
      messages.noMatches();

      return;
    }

    elements.loader.classList.remove('is-visible');

    elements.gallery.innerHTML = renderElements(data.hits);

    elements.loadButton.classList.add('is-visible');

    imageModal.refresh();
  } catch (error) {
    elements.loader.classList.remove('is-visible');

    console.log(error);
  }
};

const onLoadButtonClick = async () => {
  const galleryItemDimensions = document
    .querySelector('.gallery-item')
    .getBoundingClientRect();

  currentPage++;

  elements.loadButton.classList.remove('is-visible');
  elements.loader.classList.add('is-visible');

  try {
    const response = await getData(searchInputValue, currentPage);
    const { data } = response;
    console.log(response);
    elements.loader.classList.remove('is-visible');

    elements.gallery.insertAdjacentHTML('beforeend', renderElements(data.hits));

    imageModal.refresh();

    scrollBy({
      top: galleryItemDimensions.height * 2,
      behavior: 'smooth',
    });

    if (
      response.config.params.page * response.config.params.per_page >=
      data.totalHits
    ) {
      messages.loadsLimit();

      return;
    }

    elements.loadButton.classList.add('is-visible');
  } catch (error) {
    elements.loader.classList.remove('is-visible');

    console.log(error);
  }
};

elements.searchForm.addEventListener('submit', onSearchFormSubmit);
elements.loadButton.addEventListener('click', onLoadButtonClick);
