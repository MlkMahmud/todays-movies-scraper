/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  formatShowtimes,
  getTodayShowtimes,
} from '.';

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
