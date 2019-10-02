import {
  getNowShowingSessions,
  getMovieDetails,
  getMovieGenre,
  getCinemaName,
  getPosterUrl,
  formatReleaseDate,
  formatRuntime,
  getComingSoonMovies,
} from './helpers';


export const NowShowingMovies = async () => {
  const movies = [];
  const movieSessions = await getNowShowingSessions();
  const moviesWithDetails = await getMovieDetails(movieSessions);
  const moviesWithGenre = await getMovieGenre(moviesWithDetails);
  const moviesWithCinemaNames = await getCinemaName(moviesWithGenre);

  for (let i = 0; i < moviesWithCinemaNames.length; i += 1) {
    const {
      RunTime, genre, TrailerUrl, Synopsis, OpeningDate, Title, Rating, ID, showtimes,
    } = moviesWithCinemaNames[i];
    movies.push({
      title: Title,
      synopsis: Synopsis,
      genre,
      rating: Rating,
      poster: getPosterUrl(ID),
      trailer: TrailerUrl,
      release_date: formatReleaseDate(OpeningDate),
      runtime: formatRuntime(RunTime),
      showtimes,
      status: 'Now Showing',
    });
  }
  return movies;
};


export const comingSoonMovies = async () => {
  const payload = await getComingSoonMovies();
  const movies = [];

  for (let i = 0; i < payload.length; i += 1) {
    const {
      RunTime, Title, ScheduledFilmId, OpeningDate, Synopsis, TrailerUrl, Rating,
    } = payload[i];

    movies.push({
      title: Title,
      synopsis: Synopsis,
      rating: Rating,
      poster: getPosterUrl(ScheduledFilmId),
      trailer: TrailerUrl,
      release_date: formatReleaseDate(OpeningDate),
      runtime: formatRuntime(RunTime),
      status: 'Coming Soon',
    });
  }
  return movies;
};
