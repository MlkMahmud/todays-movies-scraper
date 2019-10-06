import { formatReleaseDate, formatRuntime } from '../../helpers';
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
  fetchComingSoonMovies,
} from '../../helpers/filmhouse';


export const nowShowingMovies = async () => {
  const movies = [];
  const sessions = await fetchNowShowingSessions();
  const movieSessions = setNowShowingSessions(sessions);
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
      now_showing: true,
    });
  }
  return movies;
};


export const comingSoonMovies = async () => {
  const entries = await fetchComingSoonMovies();
  const movies = [];

  for (let i = 0; i < entries.length; i += 1) {
    const {
      RunTime, Title, ScheduledFilmId, OpeningDate, Synopsis, TrailerUrl, Rating,
    } = entries[i];

    movies.push({
      title: Title,
      synopsis: Synopsis,
      rating: Rating,
      poster: getPosterUrl(ScheduledFilmId),
      trailer: TrailerUrl,
      release_date: formatReleaseDate(OpeningDate),
      runtime: formatRuntime(RunTime),
      now_showing: false,
    });
  }
  return movies;
};
