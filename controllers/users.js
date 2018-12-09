const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db.select('*').from('users')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  db.select('*').from('users')
    .where('username', username)
    .then((user) => {
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};
