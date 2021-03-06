const db = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending, p = 0,
  } = req.query;
  let sort_order = 'desc';
  if (sort_ascending === 'true') sort_order = 'asc';
  db.select('users.username', 'title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic', 'articles.body')
    .from('articles')
    .join('users', 'users.user_id', 'articles.user_id')
    .join('topics', 'topics.slug', 'articles.topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .offset(p)
    .limit(limit)
    .orderBy(sort_criteria, sort_order)
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
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

exports.addArticle = (req, res, next) => {
  db.insert(req.body)
    .returning('*')
    .into('articles')
    .then((article) => {
      res.status(201).send({ article: article[0] });
    })
    .catch(next);
};

exports.getArticlesByArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending, p = 0,
  } = req.query;
  let sort_order = 'desc';
  if (sort_ascending === 'true') sort_order = 'asc';
  db.select('articles.article_id', 'users.username', 'title', 'articles.votes', 'articles.created_at', 'topic', 'articles.body')
    .from('articles')
    .where('articles.article_id', `${article_id}`)
    .join('users', 'users.user_id', 'articles.user_id')
    .join('topics', 'topics.slug', 'articles.topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .limit(limit)
    .offset(p)
    .orderBy(sort_criteria, sort_order)
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .map((article) => {
      article.author = article.username;
      delete article.username;
      return article;
    })
    .then((articles) => {
      if (articles.length === 0) res.status(404).send({ message: 'page not found' });
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateArticleByArticle_Id = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  db('articles')
    .where('articles.article_id', `${article_id}`)
    .increment('votes', inc_votes)
    .returning('*')
    .then((article) => {
      res.status(202).send({ article: article[0] });
    })
    .catch(next);
};

exports.deleteArticleByArticle_Id = (req, res, next) => {
  const { article_id } = req.params;
  db('articles')
    .where('articles.article_id', `${article_id}`)
    .del()
    .then((deleteCount) => {
      console.log(deleteCount);
      if (deleteCount === 0) {
        res.status(404).send({ message: 'article does not exist' });
      } else {
        console.log('deleting the single article');
        res.status(204).send();
      }
    })
    .catch(next);
};

exports.getCommentsByArticle_Id = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_criteria = 'created_at', sort_ascending, p = 0,
  } = req.query;
  let sort_order = 'desc';
  if (sort_ascending === 'true') sort_order = 'asc';
  db.select('comments.comment_id', 'comments.votes', 'comments.created_at', 'users.username', 'comments.body').from('comments')
    .leftJoin('articles', 'articles.article_id', 'comments.article_id')
    .join('users', 'users.user_id', 'comments.user_id')
    .where('articles.article_id', `${article_id}`)
    .limit(limit)
    .offset(p)
    .orderBy(sort_criteria, sort_order)
    .map((comment) => {
      comment.author = comment.username;
      delete comment.username;
      return comment;
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentByArticle_Id = (req, res, next) => {
  req.body.article_id = req.params.article_id;
  db.insert(req.body).returning('*').into('comments')
    .then((comment) => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.updateCommentByComment_Id = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes } = req.body;
  db('comments')
    .where('comments.article_id', article_id)
    .where('comments.comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((comment) => {
      res.status(202).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.deleteCommentByComment_Id = (req, res, next) => {
  db('comments')
    .where('comments.article_id', req.params.article_id)
    .where('comments.comment_id', req.params.comment_id)
    .del()
    .then((deleteCount) => {
      console.log(deleteCount);
      if (deleteCount === 0) {
        res.status(404).send({ message: 'comment does not exist' });
      } else {
        console.log('deleting the single comment');
        res.status(204).send();
      }
    })
    .catch(next);
};
