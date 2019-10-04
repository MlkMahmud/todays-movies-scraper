/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  formatShowtimes,
  formatReleaseDate,
  formatRuntime,
  getTodayShowtimes,
  fetchCinemas,
} from '.';


describe('formatReleaseDate', () => {
  it('Should convert a date string to a suitable format', () => {
    const formattedDate = formatReleaseDate('2019-10-03T00:00:00');
    expect(formattedDate).to.equal('Oct 3');
  });
});

describe('formatRuntime', () => {
  it('Should convert runtime to a suitable format', () => {
    const runtime = formatRuntime(100);
    expect(runtime).to.equal('1h 40m');
  });
});

describe('formatShowtimes', () => {
  it('should convert a timestamp to AM//PM format', () => {
    const showtimes = [
      '2019-10-03T00:00:00',
      '2019-10-03T14:20:00',
      '2019-10-03T12:05:00',
    ];
    const formattedShowtimes = formatShowtimes(showtimes);
    formattedShowtimes.forEach((showtime) => {
      expect(showtime).to.match(/\d{1,2}:\d{2} (AM|PM)/i);
    });
  });
});

describe('getTodayShowtimes', () => {
  it('Should return only showtimes for today', () => {
    const today = new Date();
    const showtimes = [
      '2019-10-03T00:00:00',
      '2019-10-03T14:20:00',
      '2019-10-03T12:05:00',
      today,
    ];
    const todaysShowtimes = getTodayShowtimes(showtimes);
    todaysShowtimes.forEach((time) => {
      const date = new Date();
      expect(date.toDateString()).to.equal(new Date(time).toDateString());
    });
  });
});


describe('fetchCinemas', () => {
  it('Should return an array containing all Filmhouse cinemas', (done) => {
    fetchCinemas()
      .then((cinemas) => {
        expect(cinemas).to.have.property('1001', 'Filmhouse Lekki');
        expect(cinemas).to.have.property('1002', 'Filmhouse Benin');
        done();
      })
      .catch((e) => done(e));
  });
});
