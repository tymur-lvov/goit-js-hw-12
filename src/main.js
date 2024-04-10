import { getData } from './js/pixabay-api';
import { renderElements } from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
};

const messages = {
  noMatches() {
    iziToast.show({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      messageColor: '#fff',
      backgroundColor: '#ff3333',
      position: 'topRight',
    });
  },
};

const options = {
  captionsData: 'alt',
  captionDelay: 250,
};
const imageModal = new SimpleLightbox('.gallery a', options);

const onSearchFormSubmit = event => {
  event.preventDefault();

  elements.gallery.innerHTML = '';
  elements.loader.classList.add('is-open');

  getData(event)
    .then(data => {
      if (data.hits.length === 0) {
        messages.noMatches();
        return;
      }
      elements.gallery.insertAdjacentHTML(
        'beforeend',
        renderElements(data.hits)
      );
      imageModal.refresh();
    })
    .finally(() => {
      elements.loader.classList.remove('is-open');
    });
};

elements.searchForm.addEventListener('submit', onSearchFormSubmit);
