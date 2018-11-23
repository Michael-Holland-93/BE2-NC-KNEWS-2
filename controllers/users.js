const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db.many('SELECT * FROM users;')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
