const db = require('../db/connection');

exports.getComments = (req, res, next) => {
  db.select().from('comments')
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  db.insert(req.body).returning('*').into('comments').then((comment) => {
    res.status(201).send({ comment });
  })
    .catch(next);
};
