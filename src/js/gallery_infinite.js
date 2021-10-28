import {notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { fetchImages } from './apiService.js';
import murkupImages from '../views/layouts/gallery.hbs';
const basicLightbox = require('basiclightbox')

const formImage = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery-item');
let page = 1;
let currentValue = '';
formImage.addEventListener('submit', e => {
  e.preventDefault();
  currentValue = e.currentTarget.elements[0].value;

  e.currentTarget.elements[0].value = '';
  if (currentValue.length > 0) {
    page = 1;
    fetchCall();
  }
});
galleryEl.addEventListener('click', e => {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox
    .create(`<img src="${e.path[0].dataset.largeImg}" alt="${e.path[0].alt}">`)
    .show();
});
function fetchCall() {
  fetchImages(currentValue, page).then(renderImages);
}
function renderImages(valueArr) {
  if (valueArr.hits.length === 0) {
    return noticeNoResults();
  }
  const renderImages = murkupImages(valueArr.hits);
  if (page === 1) {
    galleryEl.innerHTML = renderImages;
  } else {
    galleryEl.insertAdjacentHTML('beforeend', renderImages);
  }
  page = page + 1;
  scrollInto(valueArr.hits[0].id);
  observer();
}
function scrollInto(elem) {
  const element = document.getElementById(`${elem}`);
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
function noticeNoResults() {
  const myNotice = notice({
    title: 'Sory',
    text: `No results were found for your search.`,
  });
}
function observer() {
  const options = {
    rootMargin: '0px',
    threshold: 1.0,
  };
  const observer = new IntersectionObserver(callback, options);

  function callback(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.nextElementSibling === null) {
          fetchCall();
        }
      }
    });
  }
  const galleryItem = document.querySelectorAll('li');
  galleryItem.forEach(elem => observer.observe(elem));
}

//var2
//   window.addEventListener('scroll', debounce(e => {
//    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
//      fetchImages(currentValue, page).then(renderImages);
//    }
// },300))
