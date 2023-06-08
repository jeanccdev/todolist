const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const jsonServer = require('json-server');
const db = require('../data/db.json');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Start json-server when the /server endpoint is hit
    if (pathname === '/server') {
      const server = jsonServer.create();
      const router = jsonServer.router(db);
      const middlewares = jsonServer.defaults();

      server.use(middlewares);
      server.use(router);
      server.listen(process.env.SERVER_PORT, () => {
        console.log(`JSON Server is running on port ${process.env.SERVER_PORT}`);
      });

      // Respond with a success message
      res.end('JSON Server started');
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
