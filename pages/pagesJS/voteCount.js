const apiKey = "724fa79eddb78094bf31242df4a56d93";
const apiUrlVoteCount = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en&sort_by=vote_count.desc&page=`;
const moviesPerPageVoteCount = 8;
const totalPagesVoteCount = 100;
let currentPageVoteCount = 1;
let moviesListVoteCount = [];
let currentCardIndexVoteCount = 0;

function fetchMoviesVoteCount(page) {
  fetch(apiUrlVoteCount + page)
    .then((response) => response.json())
    .then((data) => {
      moviesListVoteCount = data.results;
      displayMoviesVoteCount();
      updatePaginationVoteCount(page, totalPagesVoteCount);
      currentCardIndexVoteCount = 0;
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

function displayMoviesVoteCount() {
  const sliderVoteCount = document.getElementById("sliderVoteCount");
  sliderVoteCount.innerHTML = "";

  moviesListVoteCount.forEach((movie, index) => {
    fetchMovieCredits(movie.id, (cast, crew) => {
      const director = crew.find((member) => member.job === "Director");
      const mainCast = cast
        .slice(0, 3)
        .map((actor) => actor.name)
        .join(", ");

      sliderVoteCount.innerHTML += `
                <div class="card">
                    <a href="#" class="btn-card-vote-count" data-index="${index}">
                        <img src="https://image.tmdb.org/t/p/w500/${
                          movie.poster_path
                        }" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                           <p class="card-text text-center">${movie.release_date.slice(
                             0,
                             4
                           )}</p>
                        </div>
                    </a>
                </div>
            `;
      updateSliderPositionVoteCount();
    });
  });
}

function updateSliderPositionVoteCount() {
  const sliderVoteCount = document.getElementById("sliderVoteCount");
  const cardWidth = document.querySelector(".card").offsetWidth;
  sliderVoteCount.style.transform = `translateX(-${
    currentCardIndexVoteCount * (cardWidth + 10)
  }px)`;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".btn-card-vote-count")) {
    const index = event.target
      .closest(".btn-card-vote-count")
      .getAttribute("data-index");
    const movie = moviesListVoteCount[index];
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

document
  .getElementById("nextCardButtonVoteCount")
  .addEventListener("click", () => {
    const totalCards = moviesListVoteCount.length;
    if (currentCardIndexVoteCount < totalCards - 1) {
      currentCardIndexVoteCount++;
      updateSliderPositionVoteCount();
    }
  });

document
  .getElementById("prevCardButtonVoteCount")
  .addEventListener("click", () => {
    if (currentCardIndexVoteCount > 0) {
      currentCardIndexVoteCount--;
      updateSliderPositionVoteCount();
    }
  });

function updatePaginationVoteCount(currentPageVoteCount, totalPagesVoteCount) {
  const paginationVoteCount = document.getElementById("paginationVoteCount");
  paginationVoteCount.innerHTML = "";

  const maxButtons = 5;
  const startPage = Math.max(
    1,
    currentPageVoteCount - Math.floor(maxButtons / 2)
  );
  const endPage = Math.min(totalPagesVoteCount, startPage + maxButtons - 1);

  if (currentPageVoteCount > 1) {
    const prevPageButton = document.createElement("button");
    prevPageButton.className = "btn btn-secondary mx-1";
    prevPageButton.textContent = "Previous";
    prevPageButton.addEventListener("click", () => {
      currentPageVoteCount--;
      fetchMoviesVoteCount(currentPageVoteCount);
    });
    paginationVoteCount.appendChild(prevPageButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "btn btn-secondary mx-1";
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPageVoteCount = i;
      fetchMoviesVoteCount(currentPageVoteCount);
    });

    if (i === currentPageVoteCount) {
      pageButton.classList.add("active");
    }

    paginationVoteCount.appendChild(pageButton);
  }

  if (currentPageVoteCount < totalPagesVoteCount) {
    const nextPageButton = document.createElement("button");
    nextPageButton.className = "btn btn-secondary mx-1";
    nextPageButton.textContent = "Next";
    nextPageButton.addEventListener("click", () => {
      currentPageVoteCount++;
      fetchMoviesVoteCount(currentPageVoteCount);
    });
    paginationVoteCount.appendChild(nextPageButton);
  }
}

fetchMoviesVoteCount(currentPageVoteCount);
