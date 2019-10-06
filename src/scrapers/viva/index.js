/* eslint-disable no-await-in-loop */
import axios from 'axios';
import cheerio from 'cheerio';
import {
  formatRuntime, formatReleaseDate, getDay, fetchMoviesList,
} from '../../helpers';


export const fetchNowShowingMovieDetails = async () => {
  const html = await fetchMoviesList('https://vivacinemas.com');
  const $ = cheerio.load(html);
  const entries = $(`div#${getDay()} div.row.movie-tabs`);
  const movies = [];
  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    const movieInfo = await axios(url);
    const $$ = cheerio.load(movieInfo.data);
    const movie = {
      title: $$('header > h1').text(),
      synopsis: $$('div.plot > p').text(),
      genre: $$('span.title').text().replace(/,/g, '').split(' '),
      rating: $$('span.certificate').text(),
      poster: `https:${$$('div.row img.poster').data('lazy-src')}`,
      trailer: $$('a[data-vbtype="video"]').attr('href'),
      starring: $$('ul.movie-info li:nth-of-type(2)').text().trim().substr(9),
      release_date: formatReleaseDate($$('ul.movie-info li:nth-of-type(3)').text().substr(9)),
      runtime: formatRuntime($$('ul.movie-info li:nth-of-type(4)').text().substr(13).replace(' mins', '')),
      showtimes: [],
      now_showing: true,
    };

    $(entries[i]).find(`div.${getDay().toLowerCase()}-time`).each((index, entry) => {
      movie.showtimes.push({
        cinema: `Viva Cinemas, ${$(entry).find('label.mtime').text()}`,
        time: $(entry)
          .find('span.time')
          .text().trim()
          .replace(/\t/g, '')
          .split(/\n/),
      });
    });
    movies.push(movie);
  }
  return movies;
};

export const fetchComingSoonMovieDetails = async () => {
  const html = await fetchMoviesList('https://vivacinemas.com');
  const $ = cheerio.load(html);
  const movies = [];
  const entries = $('div.comingSoon-slides div.single-slide');

  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    const movieInfo = await axios(url);
    const $$ = cheerio.load(movieInfo.data);
    movies.push({
      title: $$('header > h1').text(),
      synopsis: $$('div.plot > p').text(),
      genre: $$('span.title').text().replace(/,/g, '').split(' '),
      rating: $$('span.certificate').text(),
      poster: `https:${$$('div.row img.poster').data('lazy-src')}`,
      trailer: $$('a[data-vbtype="video"]').attr('href'),
      starring: $$('ul.movie-info li:nth-of-type(2)').text().trim().substr(9),
      release_date: formatReleaseDate($$('ul.movie-info li:nth-of-type(3)').text().substr(9)),
      runtime: formatRuntime($$('ul.movie-info li:nth-of-type(4)')
        .text()
        .substr(13)
        .replace(' mins', '')
        .trim()),
      now_showing: false,
    });
  }
  return movies;
};
