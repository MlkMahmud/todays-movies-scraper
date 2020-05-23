/* eslint-disable no-unused-expressions */
import { before, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promise from 'chai-as-promised';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import movies from './fixtures';
import Movie from '../models/Movie';
import {
  seedDB,
  flushDB, movieAlreadyExists, addNewMovie, appendMovieShowtimes, formatRuntime, formatReleaseDate,
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
    seedDB(movies)
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
    movieAlreadyExists(movie)
      .then((result) => {
        expect(result).to.be.false;
        done();
      })
      .catch((e) => done(e));
  });

  it('Should return true if a given movie is in the movie collection', (done) => {
    const movie = { title: 'It: Chapter Two' };
    movieAlreadyExists(movie)
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
    addNewMovie(movie)
      .then((result) => {
        expect(result).to.be.true;
        movieAlreadyExists(movie)
          .then((response) => {
            expect(response).to.be.true;
            done();
          });
      })
      .catch((e) => done(e));
  });

  it('Should not add a movie without a title', () => {
    const movie = {};
    return expect(addNewMovie(movie)).to.be.rejectedWith('Movie validation failed: title: Movie must have a title');
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
    appendMovieShowtimes(movie, showtimes)
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


describe('formatRuntime', () => {
  it('Should convert runtime to a suitable format', () => {
    const runtime = formatRuntime(100);
    expect(runtime).to.equal('1h 40m');
  });

  it('Should return a default string if the time argument is invalid', () => {
    const runtime = formatRuntime('');
    expect(runtime).to.equal('--');
  });
});

describe('formatReleaseDate', () => {
  it('Should convert a date string to a suitable format', () => {
    const formattedDate = formatReleaseDate('2019-10-03T00:00:00');
    expect(formattedDate).to.equal('Oct 3');
  });

  it('Should return a default string if date value is invalid', () => {
    const formattedDate = formatReleaseDate('');
    expect(formattedDate).to.equal('--');
  });
});
