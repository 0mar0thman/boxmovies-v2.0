document.addEventListener("DOMContentLoaded", () => {
  const posterPath = localStorage.getItem("poster_path");
  const backdropPath = localStorage.getItem("backdrop_path");
  const title = localStorage.getItem("title");
  const originalTitle = localStorage.getItem("original_title");
  const overview = localStorage.getItem("overview");
  const voteAverage = localStorage.getItem("vote_average");
  const releaseDate = localStorage.getItem("release_date");
  const video_src2 = localStorage.getItem("video_src2");

  const directorInfo = JSON.parse(localStorage.getItem("director"));
  const castInfo = JSON.parse(localStorage.getItem("main_cast"));

  const directorElement = document.getElementById("director-info");
  const castElement = document.getElementById("cast-info");

  if (posterPath) {
    document.getElementById(
      "poster"
    ).src = `https://image.tmdb.org/t/p/w500/${posterPath}`;
  } else if (!posterPath) {
    document.getElementById(
      "poster"
    ).src = `https://www.google.com/url?sa=i&url=https%3A%2F%2Fsalonlfc.com%2Fimage-not-found%2F&psig=AOvVaw2OKTxeIgQ3icHFQEw-igCT&ust=1726888924962000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPi6m-PI0IgDFQAAAAAdAAAAABAE`;
  }

  document.getElementById(
    "backdrop_path"
  ).src = `https://image.tmdb.org/t/p/w500/${backdropPath}`;
  document.getElementById("title").textContent = title;
  document.getElementById(
    "original_title"
  ).textContent = `Original Title: ${originalTitle}`;
  document.getElementById("overview").textContent = overview;
  document.getElementById("average").textContent = `Rating: ${voteAverage}`;
  document.getElementById(
    "release_date"
  ).textContent = `Release Date: ${releaseDate}`;

  if (directorInfo && directorInfo.name !== "N/A") {
    const directorHtml = `
        <img src="https://image.tmdb.org/t/p/w500/${directorInfo.profile_path}" alt="${directorInfo.name}">
        <span class="castInfoJS">${directorInfo.name}</span>
      `;
    directorElement.innerHTML = directorHtml;
  } else {
    directorElement.innerHTML = "<span>N/A</span>";
  }

  if (castInfo && castInfo.length > 0) {
    castElement.innerHTML = "";
    castInfo.forEach((actor) => {
      const castHtml = `
          <div class="castInfoJS">
            <img src="https://image.tmdb.org/t/p/w500/${actor.profile_path}" alt="${actor.name}">
            <span>${actor.name}</span>
          </div>
        `;
      castElement.innerHTML += castHtml;
    });
  } else {
    castElement.innerHTML = "<span>No cast available</span>";
  }

  if (video_src2) {
    document.getElementById(
      "trailer"
    ).innerHTML = `<iframe width="560" height="315" src="${video_src2}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (video_src2 === null) {
    document.getElementsById("videoContainer").innerHTML =
      "<span>No video available</span>";
  }
});
