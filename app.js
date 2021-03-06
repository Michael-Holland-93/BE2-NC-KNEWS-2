const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handle400s, handle404s, handle500s } = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, message: 'page not found' });
});

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
