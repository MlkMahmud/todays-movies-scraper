import {
  getNowShowingSessions,
  getMovieDetails,
  getMovieGenre,
  getCinemaName,
  getPosterUrl,
  formatReleaseDate,
  formatRuntime,
} from './helpers';


const fetchNowShowingMovies = async () => {
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

export default fetchNowShowingMovies;
