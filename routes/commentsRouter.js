const commentsRouter = require('express').Router();

const { getComments, addComment } = require('../controllers/comments');

commentsRouter.route('/').get(getComments);
commentsRouter.route('/').post(addComment);

module.exports = commentsRouter;
