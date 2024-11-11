export class StorageService {
  constructor() {
    this.localStorage = window.localStorage;
    this.sessionStorage = window.sessionStorage;
  }

  saveMovie(movie, videoUrl) {
    this.localStorage.setItem(
      "poster",
      `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    );
    this.localStorage.setItem("backdrop_path", movie.backdropPath);
    this.localStorage.setItem("title", movie.title);
    this.localStorage.setItem("original_title", movie.title);
    this.localStorage.setItem("overview", movie.overview);
    this.localStorage.setItem("popularity", movie.popularity);
    this.localStorage.setItem("average", Number(movie.voteAverage.toFixed(1)));
    this.localStorage.setItem("release_date", movie.releaseDate);
    this.localStorage.setItem("id", movie.id);
    if (videoUrl) {
      this.localStorage.setItem("video_src2", videoUrl);
      this.sessionStorage.setItem("video_src2", videoUrl);
    }
    console.log("Movie data stored:", movie);
  }

  getMovie() {
    return {
      posterPath: this.localStorage.getItem("poster"),
      backdropPath: this.localStorage.getItem("backdrop_path"),
      title: this.localStorage.getItem("title"),
      originalTitle: this.localStorage.getItem("original_title"),
      overview: this.localStorage.getItem("overview"),
      popularity: this.localStorage.getItem("popularity"),
      average: this.localStorage.getItem("average"),
      releaseDate: this.localStorage.getItem("release_date"),
      id: this.localStorage.getItem("id"),
      videoSrc: this.localStorage.getItem("video_src2"),
    };
  }

  clearMovie() {
    this.localStorage.removeItem("poster");
    this.localStorage.removeItem("backdrop_path");
    this.localStorage.removeItem("title");
    this.localStorage.removeItem("original_title");
    this.localStorage.removeItem("overview");
    this.localStorage.removeItem("popularity");
    this.localStorage.removeItem("average");
    this.localStorage.removeItem("release_date");
    this.localStorage.removeItem("id");
    this.localStorage.removeItem("video_src2");
    console.log("Local storage cleared.");
  }
}
