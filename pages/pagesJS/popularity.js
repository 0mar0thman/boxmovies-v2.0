const apiKey = "724fa79eddb78094bf31242df4a56d93"; 
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en&sort_by=popularity.desc&page=`;
const moviesPerPage = 8;
const totalPages = 100;
let currentPage = 1;
let moviesList = [];
let currentCardIndex = 0;

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

function fetchMovieCredits(movieId, callback) {
  const creditsApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en`;
  fetch(creditsApiUrl)
    .then((response) => response.json())
    .then((data) => {
      callback(data.cast, data.crew);
    })
    .catch((error) => console.error("Error fetching movie credits:", error));
}

function displayMovies() {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";

  moviesList.forEach((movie, index) => {
    fetchMovieCredits(movie.id, () => {
      slider.innerHTML += `
        <div class="card">
          <a href="pageMove.html" class="btn-card" data-index="${index}">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
              <h5 class="card-title text-center">${movie.title}</h5>
            </div>
          </a>
        </div>
      `;
      updateSliderPosition();   
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

function updateSliderPosition() {
  const slider = document.getElementById("slider");
  const cardWidth = document.querySelector(".card").offsetWidth;
  slider.style.transform = `translateX(-${
    currentCardIndex * (cardWidth + 10)
  }px)`;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".btn-card")) {
    const index = event.target.closest(".btn-card").getAttribute("data-index");
    const movie = moviesList[index];
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

document.getElementById("nextCardButton").addEventListener("click", () => {
  const totalCards = moviesList.length;
  if (currentCardIndex < totalCards - 1) {
    currentCardIndex++;
    updateSliderPosition();
  }
});

document.getElementById("prevCardButton").addEventListener("click", () => {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    updateSliderPosition();
  }
});

function updatePagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
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
      fetchMovies(currentPage);
    });
    pagination.appendChild(prevPageButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "btn btn-secondary mx-1";
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      fetchMovies(currentPage);
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
      fetchMovies(currentPage);
    });
    pagination.appendChild(nextPageButton);
  }
}

fetchMovies(currentPage);
