const db = require('../db/connection');

exports.getRoutes = (req, res, next) => {
  db.then(() => {
    res.status(200).send({
      'The routes available on this api are':
        '/topics, which accesses all the topics, /users, which accesses all the users, /articles, which accesses all the articles, /comments, which accesses all the comments, /topics/:topic/articles, which accesses all the articles about one topic which can be specified, /articles/:article_id, which accesses one article which can be specified, /articles/:article_id/comments, which accesses all comments about one article which can be specified, /articles/:article_id/comments/comment_id, which accesses one comment which can be specified, /users/:username, which accesses one user which can be specified.',
    });
  })
    .catch(next);
};
