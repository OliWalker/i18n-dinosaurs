const express = require('express');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware');

const nextI18next = require('./i18n');

const nextRouter = require('./router');

const port = process.env.PORT || 3001;
const app = next({ dev: process.env.NODE_ENV !== 'production' });

const handle = nextRouter.getRequestHandler(app);

(async () => {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  server.get('*', (req, res) => handle(req, res));

  await server.listen(port);
  console.log(`> Dino's ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
