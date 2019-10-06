/* eslint-disable no-await-in-loop */
import axios from 'axios';
import cheerio from 'cheerio';
import {
  fetchMoviesList, getDay, formatReleaseDate, formatRuntime,
} from '../../helpers';

export const fetchNowShowingMovieDetails = async () => {
  const movies = [];
  const html = await fetchMoviesList('https://grandcinemas.com.ng/now-showing/');
  if (html) {
    const $ = cheerio.load(html);
    const entries = $(`div#${getDay()} .movie-tabs`);
    for (let i = 0; i < entries.length; i += 1) {
      const movie = entries[i];
      const entry = await axios($(movie).find('p > a.arrow-button').attr('href'));
      const $$ = cheerio.load(entry.data);
      movies.push({
        title: $(movie).find('header > h3').text(),
        synopsis: $$('div.plot > p').text(),
        genre: $(movie)
          .find('span.title')
          .text()
          .trim()
          .match(/\b\w+\b/g),
        rating: $(movie).find('span.certificate').text(),
        poster: $(movie).find('a > img').attr('src'),
        trailer: $$('a[data-vbtype="video"]').attr('href'),
        starring: $$('ul.movie-info li:nth-of-type(2)').text().trim().substr(9),
        release_date: formatReleaseDate($$('ul.movie-info li:nth-of-type(3)').text().substr(9)),
        runtime: formatRuntime($(movie)
          .find('div.running-time')
          .text()
          .trim()
          .substr(0, 8)
          .trim()
          .replace(' mins', '')),
        now_showing: true,
        showtimes: [
          {
            cinema: 'Grand Cinemas, Lekki',
            time: $(movie).find(`div.${getDay().toLowerCase()}-time`).text().trim()
              .match(/\d{1,2}:\d{1,2}\s(am|pm)/g),
          },
        ],
      });
    }
  }
  return movies;
};

export const fetchComingSoonMovieDetails = async () => {
  const movies = [];
  const pages = 2;

  for (let i = 1; i <= pages; i += 1) {
    const html = await fetchMoviesList(`https://grandcinemas.com.ng/movie-categories/coming-soon/page/${i}/`);
    if (html) {
      const $ = cheerio.load(html);
      const entries = $('div.movie-tabs');

      for (let j = 0; j < entries.length; j += 1) {
        const url = $(entries[j]).find('a:nth-of-type(1)').attr('href');
        const entry = await axios(url);
        const $$ = cheerio.load(entry.data);

        movies.push({
          title: $$('header > h1').text(),
          synopsis: $$('div.plot > p').text(),
          genre: $$('span.title').text().match(/\b\w+\b/g),
          rating: $$('span.certificate').text(),
          poster: `https:${$$('img.poster').attr('src')}`,
          trailer: $$('a[data-vbtype="video"]').attr('href'),
          starring: $$('ul.movie-info li:nth-of-type(2)').text().trim().substr(9),
          release_date: formatReleaseDate($$('ul.movie-info li:nth-of-type(3)').text().substr(9)),
          runtime: formatRuntime($$('ul.movie-info li:nth-of-type(4)').text().substr(13).replace(' mins', '')),
          now_showing: false,
        });
      }
    }
  }
  return movies;
};
