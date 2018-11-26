/* eslint "no-console" : 0 */

const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db.select('*').from('topics')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  db.insert(req.body).returning('*').into('topics').then((topic) => {
    res.status(201).send({ topic });
  })
    .catch(next);
};

exports.getTopicsByArticle_Id = (req, res, next) => {
  const { limit = 10, sort_order = 'desc', sort_criteria = 'articles.created_at' } = req.query;
  db.select('*').from('topics')
    .where('topic', req.params.topic)
    .innerJoin('articles', 'topics.slug', 'articles.topic')
    .innerJoin('comments', 'articles.article_id', 'comments.article_id')
    .innerJoin('users', 'comments.user_id', 'users.user_id')
    .insert({
      comment_count: ,
    })
    .limit(limit)
    .orderBy(sort_criteria, sort_order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
