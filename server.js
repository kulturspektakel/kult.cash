// const {createServer: createServerSSL} = require('https');
const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const path = require('path');
const verifySignature = require('./utils/verifySignature.js');
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '51180', 10);
// const key = process.env.PRIVATE_KEY.replace();
// const cert = fs.readFileSync(path.join(__dirname, 'server.cert'));

app.prepare().then(() => {
  createServer({}, (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const {pathname, query} = parsedUrl;
    // http://kult.cash/$$$/9A826EAE/08400a163587c8f
    const BALANCE_ROUTE = /^\/\$\$\$\/([A-F0-9]{8})\/([0-9]{4})([0-9]{1})([0-9a-f]+)$/;

    if (BALANCE_ROUTE.test(pathname)) {
      const [_, id, b, t, signature] = pathname.match(BALANCE_ROUTE);
      const balance = parseInt(b, 10);
      const tokens = parseInt(t, 10);
      if (!verifySignature(balance, tokens, id, signature)) {
        res.statusCode = 400;
        res.end('Bad Request');
      } else {
        app.render(req, res, '/balance', {balance, tokens});
      }
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
