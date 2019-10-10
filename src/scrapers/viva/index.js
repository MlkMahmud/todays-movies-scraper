/* eslint-disable no-await-in-loop */
import cheerio from 'cheerio';
import {
  formatRuntime, formatReleaseDate, getDay, fetch, list,
} from '../../helpers';


const nowShowingMovies = async () => {
  const html = await fetch('https://vivacinemas.com');
  const $ = cheerio.load(html);
  const entries = $(`div#${getDay()} div.row.movie-tabs`);
  const movies = [];
  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    const entry = await fetch(url);
    const $$ = cheerio.load(entry);
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

    $(entries[i]).find(`div.${getDay().toLowerCase()}-time`).each((index, item) => {
      movie.showtimes.push({
        cinema: `Viva Cinemas, ${$(item).find('label.mtime').text()}`,
        time: $(item)
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

const comingSoonMovies = async () => {
  const html = await fetch('https://vivacinemas.com');
  const $ = cheerio.load(html);
  const movies = [];
  const entries = $('div.comingSoon-slides div.single-slide');

  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    const entry = await fetch(url);
    const $$ = cheerio.load(entry);
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

export default [list(nowShowingMovies), list(comingSoonMovies)];
