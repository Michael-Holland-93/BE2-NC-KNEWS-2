const db = require('../db/connection');

exports.getArticles = (req, res, next) => {
  db.many('SELECT * FROM articles;')
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
