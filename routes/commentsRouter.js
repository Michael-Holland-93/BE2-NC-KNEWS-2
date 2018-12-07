const commentsRouter = require('express').Router();

const { getComments, addComment } = require('../controllers/comments');

commentsRouter.route('/').get(getComments).post(addComment);

module.exports = commentsRouter;
