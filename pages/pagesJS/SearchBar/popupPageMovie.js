const searchInput = document.getElementById("searchInput3");
const popup = document.getElementById("popup3");
const closePopup = document.getElementById("close-popup3");
const searchResults = document.getElementById("search-results3");
const searchInputInsidePageMovie = document.getElementById(
  "searchInputInsidePageMovie"
);

searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim();

  if (query) {
    popup.style.display = "block";
    searchResults.innerHTML = `Search for: ${query}`;
  } else {
    popup.style.display = "none";
  }
});

closePopup.addEventListener("click", function () {
  popup.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
});

function copy() {
  searchInput.addEventListener("input", function () {
    searchInputInsidePageMovie.value = this.value;
  });
}
copy();
