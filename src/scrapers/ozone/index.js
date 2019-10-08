/* eslint-disable no-await-in-loop */
import cheerio from 'cheerio';
import { fetch, formatReleaseDate } from '../../helpers';


export const nowShowingMovies = async () => {
  const movies = [];

  for (let page = 1; page <= 2; page += 1) {
    const movieList = await fetch(`https://ozonecinemas.com/page/${page}/`);

    if (movieList) {
      const $ = cheerio.load(movieList);
      const entries = $('.amy-ajax-content .grid-item');

      for (let i = 0; i < entries.length; i += 1) {
        const entry = await fetch($(entries[i]).find('h3.entry-title > a').attr('href'));
        const $$ = cheerio.load(entry);
        movies.push({
          title: $$('h1.entry-title').text(),
          synopsis: $$('.entry-content > p').text(),
          genre: $(entries[i]).find('.movie-char-info-right > p').text().split(),
          poster: $$('.entry-poster > img').attr('src'),
          trailer: $$('a.amy-fancybox').attr('href'),
          runtime: $$('span.duration').text().trim(),
          rating: $$('span.pg').text(),
          starring: $$('ul.info-list li:nth-of-type(1) > span').text(),
          release_date: formatReleaseDate($$('ul.info-list li:nth-of-type(4) > span').text()),
          now_showing: true,
          showtimes: [
            {
              cinema: 'Ozone Cinemas',
              time: `${$$('.info-list li:nth-of-type(7) > span').text()}: ${$$('.info-list li:nth-of-type(8) > span').text()}`,
            },
          ],
        });
      }
    }
  }
  return movies;
};

export const comingSoonMovies = async () => {

};

nowShowingMovies()
  .then((movies) => console.log(JSON.stringify(movies, null, 2)));
