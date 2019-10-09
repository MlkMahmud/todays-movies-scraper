/* eslint-disable no-await-in-loop */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  addNewMovie, movieAlreadyExists, flushDB, appendMovieShowtimes,
} from '../helpers';
import filmhouse from './filmhouse';
import viva from './viva';
import grand from './grand';
import silverbird from './silverbird';

dotenv.config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const uri = process.env.DB_URL;

const scraper = async () => {
  console.time('Duration');
  await mongoose.connect(uri, options);
  const movies = await Promise.all([...viva, ...grand, ...filmhouse, ...silverbird]);
  await flushDB();
  for (let i = 0; i < movies.length; i += 1) {
    for (let j = 0; j < movies[i].length; j += 1) {
      const movie = movies[i][j];
      const alreadyExists = await movieAlreadyExists(movie);

      if (alreadyExists) {
        appendMovieShowtimes(movie, movie.showtimes);
      } else {
        await addNewMovie(movie);
      }
    }
  }
  console.timeEnd('Duration');
};

export default scraper;
