const searchInput = document.getElementById("searchInput");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");
const searchResults = document.getElementById("search-results");
const searchInputInside = document.getElementById("searchInputInside");
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

searchInput.addEventListener("input", function () {
  searchInputInside.value = this.value;
});


