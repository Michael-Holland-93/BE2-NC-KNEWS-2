exports.handle400s = (err, req, res, next) => {
  const errorCodes = ['42703', '22P02', '23502'];
  if (errorCodes.includes(err.code)) {
    return res.status(err.status || 400).send(err.message || 'Bad request');
  }
  next(err);
};

exports.handle404s = (err, req, res, next) => {
  // if (err instanceof QueryResultError && err.code === noData) {
  //   return res.status(err.status || 404).send(err.message || 'page not found');
  // }
  // do the error codes as above
  next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(err.status || 500).send(err.message || 'internal server error');
};
