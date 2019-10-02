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
