

const apiKey = "bd27fabd4f448617eb4ef4dd33c7b66a";
const youtubeApiKey = "AIzaSyAYjh_9bTwrrncv2ENpEGSYKHtgJjv4QJY";

document.getElementById("searchInput3").addEventListener("keyup", function () {
  const query = this.value.trim();
  console.log("Query:", query); 
  if (query.length > 0) {
    searchMovies(query);
  } else {
    document.getElementById("searchResults3").innerHTML = "";
    document.getElementById("resultCount3").innerHTML = ""; // إخفاء الرسالة عند عدم وجود بحث
  }
});
document.getElementById("searchInputInsidePageMovie").addEventListener("keyup", function () {
  const query = this.value.trim();
  if (query.length > 0) {
    searchMovies(query);
  } else {
    document.getElementById("searchResults3").innerHTML = "";
    document.getElementById("resultCount3").innerHTML = ""; // إخفاء الرسالة عند عدم وجود بحث
  }
});

function searchMovies(query) { 
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en`;

  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        displaySearchResults(data.results);
      } else {
        document.getElementById("resultCount3").innerHTML = "No results found";
        document.getElementById("searchResults3").innerHTML = ""; // إخفاء النتائج عند عدم العثور على أفلام
      }
    })
    .catch((error) => console.error("Error fetching search results:", error));
}

function displaySearchResults(results) {
  let searchResultsContainer = "";
  const resultCountElement = document.getElementById("resultCount3");

  results.forEach((movie, index) => {
    searchResultsContainer += `
      <a href="http://127.0.0.1:5500/pages/pageMove.html" class="movie-link" data-movie-index="${index}">
        <div class="search-card">  
          <h5 class="search-card-span-title">
            <img 
              src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'default-poster.jpg'}" 
              class="card-img-poster" 
              alt="${movie.title}"
            > 
            ${movie.title} - (${movie.release_date ? movie.release_date.slice(0, 4) : "N/A"})
          </h5>
          <span class="search-card-span-date"></span>
          <span class="span-view">${movie.popularity} <i class="fa-solid fa-eye"></i></span>
        </div>
      </a>
    `;
  });

  resultCountElement.textContent = `Found ${results.length} Movies`;
  document.getElementById("searchResults3").innerHTML = searchResultsContainer;

  // إرفاق الأحداث لكل رابط فيلم
  attachMovieLinkEvents(results);
}

function attachMovieLinkEvents(moviesList) {
  const movieLinks = document.querySelectorAll(".movie-link");
  
  movieLinks.forEach((link, index) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const movie = moviesList[index];
      if (movie) {
        // جلب مقطع الدعائي من YouTube وحفظ البيانات
        fetchYouTubeTrailer(movie.title, (videoUrl) => {
          saveMovieToLocalStorage(movie, videoUrl);
          window.location.href = this.href;
        });
      } else {
        console.log("Movie not found in the list.");
      }
    });
  });
}

function fetchYouTubeTrailer(query, callback) {
  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query} official trailer&key=${youtubeApiKey}`;
  fetch(youtubeApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const videoId = data.items[0]?.id?.videoId;
      if (videoId) {
        const videoUrl = `https://www.youtube.com/embed/${videoId}`;
        callback(videoUrl);
      } else {
        console.log("No trailer found for the movie.");
      }
    })
    .catch((error) => console.error("Error fetching trailer:", error));
}


function saveMovieToLocalStorage(movie, videoUrl) {
  localStorage.setItem("poster_path", movie.poster_path);
  localStorage.setItem("backdrop_path", movie.backdrop_path);
  localStorage.setItem("title", movie.title);
  localStorage.setItem("original_title", movie.original_title);
  localStorage.setItem("overview", movie.overview);
  localStorage.setItem("popularity", movie.popularity);
  localStorage.setItem("vote_average", Number(movie.vote_average.toFixed(1)));
  localStorage.setItem("release_date", movie.release_date);
  localStorage.setItem("id", movie.id);
  localStorage.setItem("video_src2", videoUrl);
  console.log("Movie data and trailer URL stored in localStorage.");
}
