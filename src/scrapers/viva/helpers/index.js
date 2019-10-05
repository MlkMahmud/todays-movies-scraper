import axios from 'axios';
import cheerio from 'cheerio';

export const getDay = () => {
  const date = new Date();
  const { format } = new Intl.DateTimeFormat('en', { weekday: 'short' });
  return format(date);
};

export const fetchMoviesList = async () => {
  const url = 'https://vivacinemas.com/';
  const response = await axios(url);
  const html = response.data;
  return html;
};

export const fetchNowShowingMovieInfo = async (html) => {
  const $ = cheerio.load(html);
  const entries = Array.from($(`div#${getDay()} div.row.movie-tabs`));
  const movies = [];
  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    // eslint-disable-next-line no-await-in-loop
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
      release_date: $$('ul.movie-info li:nth-of-type(3)').text().substr(9),
      runtime: $$('ul.movie-info li:nth-of-type(4)').text().substr(13).replace('mins', ''),
      showtimes: [],
      status: 'Now Showing',
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


export const fetchComingSoonMovieInfo = async (html) => {
  const movies = [];
  const $ = cheerio.load(html);
  const entries = $('div.comingSoon-slides div.single-slide');

  for (let i = 0; i < entries.length; i += 1) {
    const url = $(entries[i]).find('p > a.arrow-button').attr('href');
    // eslint-disable-next-line no-await-in-loop
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
      release_date: $$('ul.movie-info li:nth-of-type(3)').text().substr(9),
      runtime: $$('ul.movie-info li:nth-of-type(4)')
        .text()
        .substr(13)
        .replace('mins', '')
        .trim(),
      status: 'Coming Soon',
    });
  }
  return movies;
};
