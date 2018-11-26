const topicsRouter = require('express').Router();

const { getTopics, addTopic, getTopicsByArticle_Id } = require('../controllers/topics');

topicsRouter.route('/').get(getTopics);
topicsRouter.route('/').post(addTopic);
topicsRouter.route('/:topic/articles').get(getTopicsByArticle_Id);

module.exports = topicsRouter;

// topicRouter.param();
