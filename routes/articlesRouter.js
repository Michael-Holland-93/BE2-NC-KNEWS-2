const articlesRouter = require('express').Router();

const {
  getArticles, addArticle, getArticlesByArticle_id, updateArticleByArticle_Id, deleteArticleByArticle_Id,
} = require('../controllers/articles');

articlesRouter.route('/').get(getArticles).post(addArticle);
articlesRouter.route('/:article_id').get(getArticlesByArticle_id).patch(updateArticleByArticle_Id).delete(deleteArticleByArticle_Id);

module.exports = articlesRouter;
