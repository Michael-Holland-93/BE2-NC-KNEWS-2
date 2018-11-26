const articlesRouter = require('express').Router();

const { getArticles, addArticle } = require('../controllers/articles');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/').post(addArticle);

module.exports = articlesRouter;
