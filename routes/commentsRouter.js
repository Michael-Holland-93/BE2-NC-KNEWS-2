const commentsRouter = require('express').Router();

const { getComments } = require('../controllers/comments');

commentsRouter.route('/').get(getComments);

module.exports = commentsRouter;
