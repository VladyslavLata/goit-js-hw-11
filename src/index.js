import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { markupImage } from './marcupCard';
import { fetchQuery } from './fetch';

const lightbox = new SimpleLightbox('.gallery a', {});
Notiflix.Notify.init({
  width: '400px',
  fontSize: '24px',
  info: {
    background: '#7B68EE',
  },
});

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
galleryEl.addEventListener('click', onClickCardImgOpenFullImg);
formEl.addEventListener('submit', onSearchQueryFormSubmit);
let messageAfterLastImage = false;
let amountFetchImages = null;
let maxTottalImages = null;
let currentTottalFetchImages = null;
let page = 1;
let searchQuery = '';

async function onSearchQueryFormSubmit(event) {
  const inInput = event.currentTarget.elements.searchQuery;
  event.preventDefault();

  if (searchQuery === inInput.value || inInput.value === '') {
    return;
  }
  searchQuery = inInput.value;
  resetConsts();

  try {
    const dataQuery = await fetchQuery(searchQuery, page);
    clearGallery();
    markupImages(dataQuery.hits);
    maxTottalImages = dataQuery.totalHits;
    amountFetchImages = dataQuery.hits.length;
    calcPageAndImages();
    message(amountFetchImages);
    lightbox.refresh();
    if (amountFetchImages === 0) {
      return;
    } else {
      setTimeout(() => {
        messageAfterLastImage = true;
      }, 100);
    }
  } catch (error) {
    console.log(error);
  }
}

function markupImages(datas) {
  galleryEl.insertAdjacentHTML('beforeend', datas.map(markupImage).join(''));
}

function message(amountFetchImages) {
  if (amountFetchImages > 0) {
    Notiflix.Notify.success(`Hooray! We found ${maxTottalImages} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function resetConsts() {
  page = 1;
  maxTottalImages = null;
  currentTottalFetchImages = null;
  messageAfterLastImage = false;
}

function calcPageAndImages() {
  page += 1;
  currentTottalFetchImages += amountFetchImages;
}

function onClickCardImgOpenFullImg(e) {
  e.preventDefault();
}

const options = {
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(async entry => {
    if (
      entry.isIntersecting &&
      searchQuery !== '' &&
      maxTottalImages > currentTottalFetchImages
    ) {
      try {
        const dataQuery = await fetchQuery(searchQuery, page);
        markupImages(dataQuery.hits);
        calcPageAndImages();
        lightbox.refresh();
      } catch (error) {
        console.log(error);
      }
    }
  });
}, options);

observer.observe(document.querySelector('.observer-guard'));

const optionsMessage = {
  rootMargin: '1px',
  threshold: 1.0,
};

const observerMessage = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      maxTottalImages <= currentTottalFetchImages &&
      messageAfterLastImage
    ) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      messageAfterLastImage = false;
    }
  });
}, optionsMessage);

observerMessage.observe(document.querySelector('.observer-guard'));
