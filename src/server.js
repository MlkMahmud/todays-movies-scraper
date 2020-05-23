import http from 'http';


const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end("Hello I'm a web scraper ^_^");
});

const port = process.env.PORT || 1337;
server.listen(port);
