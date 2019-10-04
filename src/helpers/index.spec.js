/* eslint-disable no-unused-expressions */
import { before, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promise from 'chai-as-promised';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movies from './fixtures';
import { Movie } from '../models/Movie';
import {
  seedDB, flushDB, movieAlreadyExists, addNewMovie, appendMovieShowtimes,
} from './index';

dotenv.config();
chai.use(promise);

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
  it('Should return false if a given movie is not in the movie collection', (done) => {
    const movie = { title: 'Shawshank Redemption' };
    movieAlreadyExists(Movie, movie)
      .then((result) => {
        expect(result).to.be.false;
        done();
      })
      .catch((e) => done(e));
  });

  it('Should return true if a given movie is in the movie collection', (done) => {
    const movie = { title: 'It: Chapter Two' };
    movieAlreadyExists(Movie, movie)
      .then((result) => {
        expect(result).to.be.true;
        done();
      })
      .catch((e) => done(e));
  });
});


describe('addNewMovie', () => {
  it('Should add a new movie to the movie collection', (done) => {
    const movie = { title: 'Gemini Man' };
    addNewMovie(Movie, movie)
      .then((result) => {
        expect(result).to.be.true;
        movieAlreadyExists(Movie, movie)
          .then((response) => {
            expect(response).to.be.true;
            done();
          });
      })
      .catch((e) => done(e));
  });

  it('Should not add a movie without a title', () => {
    const movie = {};
    return expect(addNewMovie(Movie, movie)).to.be.rejectedWith('Movie validation failed: title: Movie must have a title');
  });
});


describe('appendMovieShowtimes', () => {
  it('Should add new showtimes to a movie', (done) => {
    const showtimes = [
      {
        cinema: 'Silverbird Galleria',
        time: ['2PM', '4PM'],
      },
      {
        cinema: 'Filmhouse Cinemas',
        time: ['1PM', '5PM'],
      },
    ];
    const movie = { title: 'Gemini Man' };
    appendMovieShowtimes(Movie, movie, showtimes)
      .then((result) => {
        expect(result).to.true;
        Movie.findOne(movie, (err, doc) => {
          expect(err).to.be.null;
          expect(doc.showtimes).to.have.lengthOf(2);
          doc.showtimes.forEach((showtime) => {
            expect(showtime).to.have.property('cinema');
            expect(showtime).to.have.property('time');
          });
          done();
        });
      })
      .catch((e) => done(e));
  });
});

describe('flushDB', () => {
  it('Should delete all documents in the DB', (done) => {
    flushDB(Movie)
      .then((result) => {
        expect(result).to.be.true;
        Movie.find({}, (err, docs) => {
          expect(err).to.be.null;
          expect(docs).to.have.lengthOf(0);
          done();
        });
      })
      .catch((e) => done(e));
  });
});
