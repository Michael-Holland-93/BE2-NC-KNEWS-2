const articlesRouter = require('express').Router();

const {
  getArticles, addArticle, getArticlesByArticle_id, updateArticleByArticle_Id,
  deleteArticleByArticle_Id, getCommentsByArticle_Id, addCommentByArticle_Id,
  updateCommentByComment_Id, deleteCommentByComment_Id,
} = require('../controllers/articles');

articlesRouter.route('/').get(getArticles).post(addArticle);
articlesRouter.route('/:article_id').get(getArticlesByArticle_id).patch(updateArticleByArticle_Id).delete(deleteArticleByArticle_Id);
articlesRouter.route('/:article_id/comments').get(getCommentsByArticle_Id).post(addCommentByArticle_Id);
articlesRouter.route('/:article_id/comments/:comment_id').patch(updateCommentByComment_Id).delete(deleteCommentByComment_Id);

module.exports = articlesRouter;
