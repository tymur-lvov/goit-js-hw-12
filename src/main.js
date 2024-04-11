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
let hitsCount = null;

const onSearchFormSubmit = event => {
  event.preventDefault();

  hitsCount = 15;
  currentPage = 1;

  elements.gallery.innerHTML = '';
  elements.loader.classList.add('is-visible');
  elements.loadButton.classList.remove('is-visible');

  searchInputValue = event.srcElement.elements.search_input.value;

  getData(searchInputValue, currentPage)
    .then(response => {
      if (response.data.hits.length === 0) {
        messages.noMatches();

        return;
      }

      elements.gallery.innerHTML = renderElements(response.data.hits);

      elements.loadButton.classList.add('is-visible');

      imageModal.refresh();
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      elements.loader.classList.remove('is-visible');
    });
};

const onLoadButtonClick = () => {
  const galleryItemDimensions = document
    .querySelector('.gallery-item')
    .getBoundingClientRect();

  hitsCount += 15;
  currentPage += 1;

  elements.loadButton.classList.remove('is-visible');
  elements.loader.classList.add('is-visible');

  getData(searchInputValue, currentPage)
    .then(response => {
      elements.gallery.insertAdjacentHTML(
        'beforeend',
        renderElements(response.data.hits)
      );

      imageModal.refresh();

      scrollBy({
        top: galleryItemDimensions.height * 2,
        behavior: 'smooth',
      });

      if (hitsCount >= response.data.totalHits) {
        messages.loadsLimit();

        return;
      }

      elements.loadButton.classList.add('is-visible');
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      elements.loader.classList.remove('is-visible');
    });

  currentPage++;
};

elements.searchForm.addEventListener('submit', onSearchFormSubmit);
elements.loadButton.addEventListener('click', onLoadButtonClick);
