import {
  fetchNowShowingSessions,
  setNowShowingSessions,
  fetchMovieDetails,
  setMovieDetails,
  fetchMovieGenre,
  setMovieGenre,
  fetchCinemas,
  setCinemaName,
  getPosterUrl,
  formatReleaseDate,
  formatRuntime,
  fetchComingSoonMovies,
} from './helpers';


export const nowShowingMovies = async () => {
  const movies = [];
  const sessions = await fetchNowShowingSessions();
  const movieSessions = await setNowShowingSessions(sessions);
  const moviesWithDetails = await setMovieDetails(movieSessions, fetchMovieDetails);
  const moviesWithGenre = await setMovieGenre(moviesWithDetails, fetchMovieGenre);
  const cinemas = await fetchCinemas();
  const moviesWithCinemaNames = setCinemaName(moviesWithGenre, cinemas);

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
  const payload = await fetchComingSoonMovies();
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


comingSoonMovies()
  .then((e) => console.log(JSON.stringify(e)));
