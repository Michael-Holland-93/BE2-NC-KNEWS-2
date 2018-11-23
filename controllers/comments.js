const db = require('../db/connection');

exports.getComments = (req, res, next) => {
  db.many('SELECT * FROM comments;')
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
