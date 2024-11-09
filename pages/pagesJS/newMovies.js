const VoteMovies = (function () {
  let currentPage = 1;
  const apiKey = "bd27fabd4f448617eb4ef4dd33c7b66a";
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en&sort_by=popularity.desc&page=`;
  const maxMoviesPerPage = 30;  
  let moviesList;

  function fetchMovies(page) {
    const urlWithPage = `${apiUrl}&page=${page}`;
    fetch(urlWithPage)
      .then((response) => response.json())
      .then((data) => {
        moviesList = data.results;
        displayMovies();
        updatePagination(page, totalPages);
        currentCardIndex = 0; 
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }

  function displayMovies() {
    let container = "";
    for (let i = 0; i < Math.min(moviesList.length, maxMoviesPerPage); i++) {
      container += `
            <div class="card card-new-movies">  
              <a href="pages/pageMove.html" class="btn-vote btn-card" data-vote-index="${i}">
                <img src="https://image.tmdb.org/t/p/w500/${moviesList[i].poster_path}" class="card-img-top">
               <div class="card-body">
                <h5>${moviesList[i].title}</h5>
                <p class="card-text text-center">${moviesList[i].release_date.slice(0,4)}</p>
               </div>
              </a>
            </div>
    `;
    }
    document.getElementById("voteCount").innerHTML += container;
    attachTrailerEvents();
  }

  function fetchYouTubeTrailer(movieId, callback) {
    const videoApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en`;
    fetch(videoApiUrl)
      .then((response) => response.json())
      .then((data) => {
        let video = data.results.find((video) => video.type === "Trailer");
        if (!video) {
          video = data.results.find(
            (video) => video.type === "Teaser" && video.site === "YouTube"
          );
        }
        if (video) {
          const videoUrl = `https://www.youtube.com/embed/${video.key}`;
          callback(videoUrl);
        } else {
          console.log("No trailer or teaser found for this movie.");
          callback(null);
        }
      })
      .catch((error) => console.error("Error fetching video:", error));
  }

  function saveMovieToLocalStorage(movie, videoUrl) {
    localStorage.setItem("poster_path", movie.poster_path);
    localStorage.setItem("backdrop_path", movie.backdrop_path);
    localStorage.setItem("title", movie.title);
    localStorage.setItem("original_title", movie.original_title);
    localStorage.setItem("overview", movie.overview);
    localStorage.setItem("popularity", movie.popularity);
    localStorage.setItem("average", Number(movie.vote_average.toFixed(1)));
    localStorage.setItem("release_date", movie.release_date);
    localStorage.setItem("id", movie.id);
    if (videoUrl) {
      localStorage.setItem("video_src2", videoUrl);
      sessionStorage.setItem("video_src2", videoUrl);
    }
    console.log("Vote movie data stored:", movie);
  }

  function attachTrailerEvents() {
    const films = document.querySelectorAll(".btn-vote");
    films.forEach((film) => {
      film.addEventListener("click", function (event) {
        event.preventDefault();
        const index = this.getAttribute("data-vote-index");
        const movie = moviesList[index];
        if (movie) {
          fetchYouTubeTrailer(movie.id, (videoUrl) => {
            saveMovieToLocalStorage(movie, videoUrl);
            window.location.href = "pages/pageMove.html";
          });
        } else {
          console.log("Vote movie not found in the list.");
        }
      });
    });
  }

  document
    .getElementById("nextVotePageButton")
    .addEventListener("click", function () {
      currentPage++;
      fetchMovies(currentPage);
    });

  fetchMovies(currentPage);

  return {
    fetchMovies: fetchMovies,
  };
})();
