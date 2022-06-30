import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { markupImage } from './marcupCard';
import { fetchQuery } from './fetch';

const lightbox = new SimpleLightbox('.gallery a', {});
axios.defaults.baseURL = 'https://pixabay.com';
Notiflix.Notify.init({
  width: '400px',
  fontSize: '24px',
  info: {
    background: '#7B68EE'
  }
});

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
galleryEl.addEventListener('click', onClickCardImgOpenFullImg);
formEl.addEventListener('submit', onSearchQueryFormSubmit);
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
  page = 1;
  maxTottalImages = null;
  currentTottalFetchImages = null;
  try {
    const dataQuery = await fetchQuery(searchQuery, page);
    clearGallery();
    markupImages(dataQuery.hits);
    maxTottalImages = dataQuery.totalHits;
    amountFetchImages = dataQuery.hits.length;
    calcPageAndImages();
    message(amountFetchImages);
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
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function calcPageAndImages() {
  page += 1;
  currentTottalFetchImages += amountFetchImages;
}

function onClickCardImgOpenFullImg(e) {
  e.preventDefault();
}

const options = {
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && searchQuery !== ''
      && maxTottalImages > currentTottalFetchImages) {

      try {
  const dataQuery = await fetchQuery(searchQuery, page);
        markupImages(dataQuery.hits);
        calcPageAndImages();
  } catch (error) {
    console.log(error);
  }

    } else if (entry.isIntersecting && searchQuery !== ''
      && maxTottalImages <= currentTottalFetchImages) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}, options);

observer.observe(document.querySelector('.observer-guard'));

