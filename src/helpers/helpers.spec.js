/* eslint-disable no-unused-expressions */
import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movies from '../dummyData';
import Movie from '../models/Movie';
import {
  seedDB, flushDB, movieAlreadyExists, addNewMovie, appendMovieShowtimes,
} from './index';

dotenv.config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const uri = process.env.DB_TEST_URL;

before((done) => {
  mongoose.connect(uri, options)
    .then(() => done())
    .catch((e) => done(e));
});


describe('seedDB', () => {
  it('Should add multiple documents to the database', (done) => {
    seedDB(Movie, movies)
      .then((result) => {
        expect(result).to.be.true;
        Movie.find({}, (err, docs) => {
          expect(docs.length).to.equal(movies.length);
          expect(err).to.be.null;
          done();
        });
      })
      .catch((e) => done(e));
  });
});

describe('movieAlreadyExists', () => {
  it('Should check if a movie already exists in the database', (done) => {
    const movie = { title: 'Shawshank Redemption' };
    movieAlreadyExists(Movie, movie)
      .then((result) => {
        expect(result).to.be.false;
        done();
      })
      .catch((e) => done(e));
  });
});
