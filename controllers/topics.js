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
    res.status(201).send({ topic: topic[0] });
  })
    .catch(next);
};

exports.getArticlesByTopic_Id = (req, res, next) => {
  const {
    limit = 10, sort_ascending, sort_criteria = 'articles.created_at', p = 0,
  } = req.query;
  let sort_order = 'desc';
  if (sort_ascending === 'true') sort_order = 'asc';
  db.select('username', 'title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic')
    .from('articles')
    .where('articles.topic', req.params.topic)
    .innerJoin('topics', 'topics.slug', 'articles.topic')
    .innerJoin('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .limit(limit)
    .offset(p)
    .orderBy(sort_criteria, sort_order)
    .map((article) => {
      article.author = article.username;
      delete article.username;
      return article;
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addTopicByArticle_Id = (req, res, next) => {
  req.body.topic = req.params.topic;
  db.insert(req.body)
    .returning('*')
    .into('articles')
    .then((article) => {
      res.status(201).send({ article: article[0] });
    })
    .catch(next);
};
