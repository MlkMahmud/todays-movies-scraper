export const movieAlreadyExists = async (collection, { title }) => {
  try {
    const results = await collection.find({ $text: { $search: title } });
    if (results.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const appendMovieShowtimes = async (collection, { title }, { showtimes }) => {
  try {
    await collection.update({ title }, { $push: { showtimes: { $each: showtimes } } });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const addNewMovie = async (collection, movie) => {
  try {
    await collection.create(movie);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const seedDB = async (collection, movies = []) => {
  try {
    await collection.insertMany(movies);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const flushDB = async (collection) => {
  try {
    await collection.deleteMany({});
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
