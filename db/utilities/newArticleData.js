const {
  topicData, userData, articleData, commentData,
} = require('../data/index');

exports.newArticle = userRows => articleData.reduce((newArray, article, index) => {
  const correspondingUser = userRows.find((user) => {
    if (user.username === article.created_by) {
      return user;
    }
  });
  const newArticle = {};
  newArticle.title = article.title;
  newArticle.topic = article.topic;
  newArticle.user_id = correspondingUser.user_id;
  newArticle.body = article.body;
  newArticle.created_at = new Date(article.created_at);
  newArray[index] = newArticle;
  return newArray;
}, []);
