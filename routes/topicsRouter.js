const topicsRouter = require('express').Router();

const {
  getTopics, addTopic, getArticlesByTopic_Id, addTopicByArticle_Id,
} = require('../controllers/topics');

topicsRouter.route('/').get(getTopics).post(addTopic);

// topicsRouter.param('topic', (req, res, next, topic) => {
//   // validate the topic then move to the next function if it is valid or got to the error handler
//   // may need to use regex for some of these checks
//   if (topic === 'coding' || 'football' || 'cooking') next();
//   else if (typeof topic !== String) next({ status: 400, message: 'malformed syntax' });
//   next({ status: 422, message: 'unprocessable entity' });
// });

topicsRouter.route('/:topic/articles').get(getArticlesByTopic_Id).post(addTopicByArticle_Id);

module.exports = topicsRouter;
