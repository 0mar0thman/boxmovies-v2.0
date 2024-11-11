const apiKey = "724fa79eddb78094bf31242df4a56d93";
const apiUrlVotedMovies = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en&sort_by=vote_average.desc&page=`;
const moviesPerPageVotedMovies = 8;
const totalPagesVotedMovies = 100;
let currentPageVotedMovies = 1;
let moviesListVotedMovies = [];
let currentCardIndexVotedMovies = 0;

function fetchMoviesVotedMovies(page) {
  fetch(apiUrlVotedMovies + page)
    .then((response) => response.json())
    .then((data) => {
      moviesListVotedMovies = data.results;
      displayMoviesVotedMovies();
      updatePaginationVotedMovies(page, totalPagesVotedMovies);
      currentCardIndexVotedMovies = 0;
    })
    .catch((error) => console.error("Error fetching Voted Movies:", error));
}

function fetchMovieCredits(movieId, callback) {
  const creditsApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en`;
  fetch(creditsApiUrl)
    .then((response) => response.json())
    .then((data) => {
      callback(data.cast, data.crew);
    })
    .catch((error) => console.error("Error fetching movie credits:", error));
}

function displayMoviesVotedMovies() {
  const slider = document.getElementById("sliderVotedMovies");
  slider.innerHTML = "";

  moviesListVotedMovies.forEach((movie, index) => {
    fetchMovieCredits(movie.id, (cast, crew) => {
      const director = crew.find((member) => member.job === "Director");
      const mainCast = cast
        .slice(0, 3)
        .map((actor) => actor.name)
        .join(", ");

      slider.innerHTML += `
        <div class="card">
          <a href="pageMove.html" class="btn-card-voted-movies" data-index="${index}">
            <img src="https://image.tmdb.org/t/p/w500/${
              movie.poster_path
            }" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
              <h5 class="card-title text-center">${movie.title}</h5>
              <p class="card-text text-center">${movie.release_date.slice(0, 4)}</p>
            </div>
          </a>
        </div>
      `;
      updateSliderPositionVotedMovies();
    });
  });
}

function storeMovieCredits(movieId) {
  fetchMovieCredits(movieId, (cast, crew) => {
    const director = crew.find((member) => member.job === "Director");
    const mainCast = cast.slice(0, 8).map((actor) => ({
      name: actor.name,
      profile_path: actor.profile_path,
    }));

    localStorage.setItem(
      "director",
      JSON.stringify({
        name: director ? director.name : "N/A",
        profile_path: director ? director.profile_path : null,
      })
    );
    localStorage.setItem("main_cast", JSON.stringify(mainCast));
  });
}

function updateSliderPositionVotedMovies() {
  const slider = document.getElementById("sliderVotedMovies");
  const cardWidth = document.querySelector(".card").offsetWidth;
  slider.style.transform = `translateX(-${
    currentCardIndexVotedMovies * (cardWidth + 10)
  }px)`;
}

// Handle card click events
document.addEventListener("click", (event) => {
  if (event.target.closest(".btn-card-voted-movies")) {
    const index = event.target
      .closest(".btn-card-voted-movies")
      .getAttribute("data-index");
    const movie = moviesListVotedMovies[index];
    if (movie) {
      localStorage.setItem("poster_path", movie.poster_path);
      localStorage.setItem("backdrop_path", movie.backdrop_path);
      localStorage.setItem("title", movie.title);
      localStorage.setItem("original_title", movie.original_title);
      localStorage.setItem("overview", movie.overview);
      localStorage.setItem("popularity", movie.popularity);
      localStorage.setItem(
        "vote_average",
        Number(movie.vote_average.toFixed(1))
      );
      localStorage.setItem("release_date", movie.release_date);
      localStorage.setItem("id", movie.id);

      storeMovieCredits(movie.id);

      fetchYouTubeTrailer(movie.id, (videoUrl) => {
        localStorage.setItem("video_src2", videoUrl);
        window.location.href = "pageMove.html";
      });
    }
  }
});

function fetchYouTubeTrailer(movieId, callback) {
  const videoApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en`;
  fetch(videoApiUrl)
    .then((response) => response.json())
    .then((data) => {
      let video = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (!video) {
        video = data.results.find(
          (video) => video.type === "Teaser" && video.site === "YouTube"
        );
      }
      const videoUrl = video
        ? `https://www.youtube.com/embed/${video.key}`
        : null;
      callback(videoUrl);
    })
    .catch((error) => console.error("Error fetching video:", error));
}

document
  .getElementById("nextCardButtonVotedMovies")
  .addEventListener("click", () => {
    const totalCards = moviesListVotedMovies.length;
    if (currentCardIndexVotedMovies < totalCards - 1) {
      currentCardIndexVotedMovies++;
      updateSliderPositionVotedMovies();
    }
  });

document
  .getElementById("prevCardButtonVotedMovies")
  .addEventListener("click", () => {
    if (currentCardIndexVotedMovies > 0) {
      currentCardIndexVotedMovies--;
      updateSliderPositionVotedMovies();
    }
  });

function updatePaginationVotedMovies(currentPage, totalPages) {
  const pagination = document.getElementById("paginationVotedMovies");
  pagination.innerHTML = ""; 

  const maxButtons = 5; 
  const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (currentPage > 1) {
    const prevPageButton = document.createElement("button");
    prevPageButton.className = "btn btn-secondary mx-1";
    prevPageButton.textContent = "Previous";
    prevPageButton.addEventListener("click", () => {
      currentPage--;
      fetchMoviesVotedMovies(currentPage);
    });
    pagination.appendChild(prevPageButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "btn btn-secondary mx-1";
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      fetchMoviesVotedMovies(currentPage);
    });

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pagination.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextPageButton = document.createElement("button");
    nextPageButton.className = "btn btn-secondary mx-1";
    nextPageButton.textContent = "Next";
    nextPageButton.addEventListener("click", () => {
      currentPage++;
      fetchMoviesVotedMovies(currentPage);
    });
    pagination.appendChild(nextPageButton);
  }
}

fetchMoviesVotedMovies(currentPageVotedMovies);
