import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';


const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '23933594-99c5d6abfa76120a4e36d3057'

export function fetchImages(searchQuery, page) {
  let url = BASE_URL + `?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${API_KEY}`
  return fetch(`${url}`).then(response).catch(onFetchError)

}

function response(result) {
  return result.json();
}
function onFetchError(mistake) {
  const myError = error({
    title:'Error',
    text: `${mistake}`,
  });
}