import http from 'http';
import { getAllMovies, flushFirestore, seedFireStore } from './helpers';
import { scraper } from './scrapers';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end("Hello I'm a web scraper ^_^");
});

const port = process.env.PORT || 1337;
server.listen(port);

(async function () {
  console.time('Duration');
  await scraper();
  const movies = await getAllMovies();
  if (await flushFirestore()) {
    await seedFireStore(movies);
  }
  console.timeEnd('Duration');
})();
