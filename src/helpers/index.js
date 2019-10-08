import axios from 'axios';

export const movieAlreadyExists = async (collection, { title }) => {
  const results = await collection.find({ $text: { $search: title } });
  if (results.length > 0) {
    return true;
  }
  return false;
};

export const appendMovieShowtimes = async (collection, { title }, showtimes) => {
  await collection.updateOne({ title }, { $push: { showtimes: { $each: showtimes } } });
  return true;
};

export const addNewMovie = async (collection, item) => {
  await collection.create(item);
  return true;
};

export const seedDB = async (collection, items = []) => {
  await collection.insertMany(items);
  return true;
};

export const flushDB = async (collection) => {
  await collection.deleteMany({});
  return true;
};

export const delay = (ms) => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  })
);

export const retry = async (fn, attempts = 3, wait = 5000) => {
  try {
    const response = await fn();
    return response;
  } catch (e) {
    if (attempts <= 1) {
      throw Error(e);
    }
    await delay(wait);
    return retry(fn, attempts - 1);
  }
};

export const formatRuntime = (time) => {
  if (!time || Number.isNaN(Number(time))) {
    return '--';
  }
  const hours = Math.floor(+time / 60);
  const mins = +time % 60;
  return `${hours}h ${mins}m`;
};

export const formatReleaseDate = (date) => {
  if (!date || Number.isNaN(Date.parse(date))) {
    return '--';
  }
  const dateString = new Date(date);
  const { format } = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  return format(dateString);
};

export const getDay = () => {
  const date = new Date();
  const { format } = new Intl.DateTimeFormat('en', { weekday: 'short' });
  return format(date);
};

export const fetch = async (url) => {
  try {
    const response = await axios(url);
    return response.data;
  } catch (e) {
    // Handle 404 errors
    if (e.message === 'Request failed with status code 404') {
      return null;
    }
    throw (e);
  }
};

export const movieList = async (cinema) => {
  try {
    const movies = await retry(cinema);
    return movies;
  } catch (e) {
    console.error(e);
    return [];
  }
};
