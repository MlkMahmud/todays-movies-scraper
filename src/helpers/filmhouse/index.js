import axios from 'axios';


export const fetchNowShowingSessions = async () => {
  const url = 'https://us-central1-filmhouseweb-403f1.cloudfunctions.net/api/movie/getNowShowingSessions';
  const response = await axios(url);
  return response.data;
};

export const setNowShowingSessions = (sessions = []) => {
  const movies = {};
  for (let i = 0; i < sessions.length; i += 1) {
    const { ScheduledFilmId, CinemaId, Showtime } = sessions[i];
    if (ScheduledFilmId in movies) {
      if (CinemaId in movies[ScheduledFilmId]) {
        movies[ScheduledFilmId][CinemaId].push(Showtime);
      } else {
        movies[ScheduledFilmId][CinemaId] = [Showtime];
      }
    } else {
      movies[ScheduledFilmId] = {
        [CinemaId]: [Showtime],
      };
    }
  }
  return movies;
};

export const fetchComingSoonMovies = async () => {
  const url = 'https://us-central1-filmhouseweb-403f1.cloudfunctions.net/api/movie/getComingSoonMovies/';
  const response = await axios(url);
  return response.data;
};

export const formatShowtimes = (showtimes = []) => (
  showtimes.map((time) => {
    const date = new Date(time);
    const { format } = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' });
    return format(date);
  })
);

export const getTodayShowtimes = (showtimes = []) => (
  showtimes.filter((time) => {
    const date = new Date(time);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  })
);

export const fetchMovieDetails = async (id) => {
  const url = 'https://us-central1-filmhouseweb-403f1.cloudfunctions.net/api/movie/getMovieDetails';
  const details = await axios(url, { params: { movieId: id } });
  return details.data;
};

export const setMovieDetails = async (sessions = {}, fn) => {
  const movies = [];
  const keys = Object.keys(sessions);
  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const details = await fn(keys[i]);
    const [movie] = details;
    movie.showtimes = [];
    const entries = Object.entries(sessions[keys[i]]);
    for (let j = 0; j < entries.length; j += 1) {
      const [cinema, time] = entries[j];
      const todayShowtimes = getTodayShowtimes(time);
      if (todayShowtimes.length > 0) {
        movie.showtimes.push({
          cinema,
          time: formatShowtimes(todayShowtimes),
        });
      }
    }
    movies.push(movie);
  }
  return movies;
};

export const fetchMovieGenre = async (id) => {
  const url = 'https://us-central1-filmhouseweb-403f1.cloudfunctions.net/api/movie/getGenreName';
  const response = await axios(url, {
    params: {
      genreId: id,
    },
  });
  return response.data;
};

export const setMovieGenre = async (entries = [], fn) => {
  const movies = [...entries];
  const genres = {};
  for (let i = 0; i < movies.length; i += 1) {
    const { GenreId: genreId } = movies[i];
    if (!(genreId in genres)) {
      // eslint-disable-next-line no-await-in-loop
      const genre = await fn(genreId);
      genres[genreId] = genre;
    }
    movies[i].genre = [genres[genreId]];
  }
  return movies;
};

export const fetchCinemas = async () => {
  const url = 'https://us-central1-filmhouseweb-403f1.cloudfunctions.net/api/cinema/getCinemasLocations';
  const response = await axios(url);
  const { data } = response;
  return data.reduce((acc, cur) => ({ ...acc, [cur.ID]: cur.Name }), {});
};

export const setCinemaName = (entries = [], cinemas = []) => {
  const movies = [...entries];
  for (let i = 0; i < movies.length; i += 1) {
    const { showtimes } = movies[i];
    for (let j = 0; j < showtimes.length; j += 1) {
      const { cinema } = showtimes[j];
      movies[i].showtimes[j].cinema = cinemas[cinema];
    }
  }
  return movies;
};

export const getPosterUrl = (id) => `https://tickets.filmhouseng.com/CDN/media/entity/get/FilmPosterGraphic/${id}`;
