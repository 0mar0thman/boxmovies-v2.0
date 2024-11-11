import { MoviePage } from './MoviePage.js';
import { StorageService } from './ServiceOOP.js';

document.addEventListener("DOMContentLoaded", function () {
  const storageService = new StorageService();
  const moviePage = new MoviePage(storageService);

  moviePage.updateDOM();
});
