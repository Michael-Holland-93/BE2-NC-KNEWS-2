const pgp = require('pg-promise');

const { QueryResultError } = pgp.errors;
const { noData } = pgp.errors.queryResultErrorCode;

exports.handle400s = (err, req, res, next) => {
  const errorCodes = ['42703', '22P02', '23502'];
  if (errorCodes.includes(err.code)) {
    return res.status(err.status || 400).send(err.message || 'Bad request');
  }
  next(err);
};

exports.handle404s = (err, req, res, next) => {
  if (err instanceof QueryResultError && err.code === noData) {
    res.status(err.status || 404).send(err.msg || 'page not found');
  }
  next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.msg || 'internal server error');
};
