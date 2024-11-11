export class MoviePage {
  constructor(storageService) {
    this.storageService = storageService;
  }

  updateDOM() {
    const data = this.storageService.getMovie();

    this.updateElement(
      "backdrop_path",
      `https://image.tmdb.org/t/p/w500/${data.backdropPath}`
    );
    this.updateElement(
      "poster",
      `https://image.tmdb.org/t/p/w500/${data.posterPath}`
    );

    this.updateTextElement("title", data.title);
    this.updateTextElement(
      "original_title",
      `Original Title: ${data.originalTitle}`
    );
    this.updateTextElement(
      "overview",
      `Overview: ${data.overview.slice(0, 250)}`
    );
    this.updateTextElement("popularity", `Popularity: ${data.popularity}`);
    this.updateTextElement("release_date", `Release Date: ${data.releaseDate}`);
    this.updateTextElement("average", `Average Vote: ${data.average}`);

    this.updateVideoContainer(data.videoSrc);
  }

  updateElement(id, src) {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
    }
  }

  updateTextElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  updateInnerHTML(id, html) {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  updateVideoContainer(videoSrc) {
    const videoContainer = document.getElementById("videoContainer");
    if (videoContainer) {
      if (videoSrc) {
        videoContainer.innerHTML = `<iframe width="560" height="315" src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        videoContainer.innerHTML = "No video available.";
      }
    }
  }
}
