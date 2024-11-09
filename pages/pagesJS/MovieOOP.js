// // Movie.js
// export class Movie {
//   constructor(id, title, posterPath, backdropPath, overview, popularity, voteAverage, releaseDate) {
//     this.id = id;
//     this.title = title;
//     this.posterPath = posterPath;
//     this.backdropPath = backdropPath;
//     this.overview = overview;
//     this.popularity = popularity;
//     this.voteAverage = voteAverage;
//     this.releaseDate = releaseDate;
//   }

//   getFormattedReleaseDate() {
//     return new Date(this.releaseDate).getFullYear();
//   }

//   getShortOverview(maxLength = 100) {
//     return this.overview.length > maxLength ? this.overview.substring(0, maxLength) + "..." : this.overview;
//   }
// }
