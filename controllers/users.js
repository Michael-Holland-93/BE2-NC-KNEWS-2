const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db.select('*').from('users')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.addUser = (req, res, next) => {
  db.insert(req.body).returning('*').into('users').then((user) => {
    res.status(201).send({ user });
  })
    .catch(next);
};
