

// import { Movie } from './MovieOOP.js';
// import { StorageService } from './StorageOOP/ServiceOOP.js';

// export class MovieService {
//   constructor(apiKey, apiUrl, maxMoviesPerPage) {
//     this.apiKey = apiKey;
//     this.apiUrl = apiUrl;
//     this.maxMoviesPerPage = maxMoviesPerPage;
//     this.currentPage = 1;
//     this.moviesList = [];
//     this.storageService = new StorageService();
//   }

//   fetchMovies(page, callback) {
//     fetch(`${this.apiUrl}&page=${page}&api_key=${this.apiKey}`)
//       .then(response => response.json())
//       .then(data => {
//         this.moviesList = data.results.map(movieData => new Movie(
//           movieData.id,
//           movieData.title,
//           movieData.poster_path,
//           movieData.backdrop_path,
//           movieData.overview,
//           movieData.popularity,
//           movieData.vote_average,
//           movieData.release_date
//         ));
//         callback();
//       })
//       .catch(error => console.error("Error fetching movies:", error));
//   }

//   fetchYouTubeTrailer(movieId, callback) {
//     const videoApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.apiKey}&language=en`;
//     fetch(videoApiUrl)
//       .then(response => response.json())
//       .then(data => {
//         let video = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
//         if (!video) {
//           video = data.results.find(video => video.type === "Teaser" && video.site === "YouTube");
//         }
//         const videoUrl = video ? `https://www.youtube.com/embed/${video.key}` : null;
//         callback(videoUrl);
//       })
//       .catch(error => console.error("Error fetching video:", error));
//   }

//   saveMovieToStorage(movie, videoUrl) {
//     this.storageService.saveMovie(movie, videoUrl);
//   }

//   attachTrailerEvents(selector, callback) {
//     const films = document.querySelectorAll(selector);
//     films.forEach(film => {
//       film.addEventListener("click", event => {
//         event.preventDefault();
//         const index = film.getAttribute("data-index");
//         const movie = this.moviesList[index];
//         if (movie) {
//           this.fetchYouTubeTrailer(movie.id, videoUrl => {
//             this.saveMovieToStorage(movie, videoUrl);
//             callback();
//           });
//         } else {
//           console.log("Movie not found in the list.");
//         }
//       });
//     });
//   }
// }
