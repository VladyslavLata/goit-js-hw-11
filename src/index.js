import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { markupImages } from './marcupCard';
import { fetchQuery } from './fetch';

const lightbox = new SimpleLightbox('.gallery a', {});
axios.defaults.baseURL = 'https://pixabay.com';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
galleryEl.addEventListener('click', onClickCardImgOpenFullImg);
formEl.addEventListener('submit', onSearchQueryFormSubmit);
let page = 1;
let searchQuery = '';

// const observer = new IntersectionObserver(entries => )

async function onSearchQueryFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  try {
    const dataQuery = await fetchQuery();
    galleryEl.insertAdjacentHTML('beforeend', markupImages(dataQuery.hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

function onClickCardImgOpenFullImg(e) {
  e.preventDefault();
}
