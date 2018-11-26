const db = require('../db/connection');

exports.getArticles = (req, res, next) => {
  db.select().from('articles')
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  db.insert(req.body).returning('*').into('articles').then((article) => {
    res.status(201).send({ article });
  })
    .catch(next);
};
