/* eslint-disable no-await-in-loop */
import axios from 'axios';
import cheerio from 'cheerio';
import {
  fetchMoviesList, getDay, formatReleaseDate, formatRuntime,
} from '../../helpers';

export const fetchMoviDetails = async () => {
  const movies = [];
  const html = await fetchMoviesList('https://grandcinemas.com.ng/now-showing/');
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
  return movies;
};
