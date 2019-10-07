/* eslint-disable no-await-in-loop */
import cheerio from 'cheerio';
import { fetch, formatReleaseDate } from '../../helpers';
import { filterForeignCinemas, formatRuntime } from '../../helpers/silverbird';

export const nowShowingMovies = async () => {
  const movies = [];
  for (let page = 1; page <= 2; page += 1) {
    const movieList = await fetch(`https://silverbirdcinemas.com/page/${page}/`);
    if (movieList) {
      const $ = cheerio.load(movieList);
      const entries = $('div.active article.entry-item');

      for (let i = 0; i < entries.length; i += 1) {
        const entryURL = $(entries[i]).find('div.entry-button > a').attr('href');
        const entry = await fetch(entryURL);
        const $$ = cheerio.load(entry);
        movies.push({
          title: $$('h1.entry-title > a').text(),
          synopsis: $$('div.entry-content blockquote p, div.entry-content ol li').text(),
          starring: $$('ul.info-list li:nth-child(1) span').text(),
          genre: $$('ul.info-list li:nth-child(3) span a:nth-of-type(1)').text().trim().split(),
          poster: $$('div.entry-thumb img').attr('src'),
          trailer: $$('div.media-item > a').attr('href'),
          release_date: formatReleaseDate($$('ul.info-list li:nth-child(4) > span').text()),
          rating: $$('div.entry-pg span.pg').text(),
          runtime: formatRuntime($$('div.entry-pg .duration').text().trim()),
          showtimes: [],
          now_showing: true,
        });

        const rgx = /\w+((\/|\-)\w+)*: (\d{1,2}:\d{1,2}(am|pm)(,\s)?)+/g
        $$('div.movie_showtime_block h4').each((index, element) => {
          movies[movies.length - 1].showtimes.push({
            cinema: $$(element).text(),
          });
        });

        $$('div.movie_showtime_block p.time').each((index, element) => {
          movies[movies.length - 1].showtimes[index].time = $$(element).text().match(rgx);
        });
        const { showtimes } = movies[movies.length - 1];
        movies[movies.length - 1].showtimes = filterForeignCinemas(showtimes);
      }
    }
  }
  return movies;
};


export const comingSoonMovies = async () => {
  const movies = [];
  const movieList = await fetch('https://silverbirdcinemas.com/coming-soon/');
  if (movieList) {
    const $ = cheerio.load(movieList);
    const entries = $('article.entry-item');
    for (let i = 0; i < entries.length; i += 1) {
      const url = $(entries[i]).find('h2.entry-title > a').attr('href');
      const entry = await fetch(url);
      const $$ = cheerio.load(entry);
      movies.push({
        title: $$('h1.entry-title > a').text(),
        synopsis: $$('div.entry-content blockquote p, div.entry-content ol li').text(),
        starring: $$('ul.info-list li:nth-child(1) span').text(),
        genre: $$('ul.info-list li:nth-child(3) span a:nth-of-type(1)').text().trim().split(),
        poster: $$('div.entry-thumb img').attr('src'),
        trailer: $$('div.media-item > a').attr('href'),
        release_date: formatReleaseDate($$('ul.info-list li:nth-child(4) > span').text()),
        rating: $$('div.entry-pg span.pg').text(),
        runtime: formatRuntime($$('div.entry-pg .duration').text().trim()),
        now_showing: false,
      });
    }
  }
  return movies;
};
