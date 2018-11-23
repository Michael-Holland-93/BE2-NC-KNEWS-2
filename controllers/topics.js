/* eslint "no-console" : 0 */

const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  // SELECT * FROM topics;  * means all columns
  db.select('*').from('topics')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
