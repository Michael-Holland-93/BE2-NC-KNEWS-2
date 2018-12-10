const {
  topicData, userData, articleData, commentData,
} = require('../data/index');

exports.newComment = (articleRows, userRows) => {
  return commentData.reduce((newArray, comment, index) => {
    const correspondingUser = userRows.find((user) => {
      if (user.username === comment.created_by) {
        return user;
      }
    });
    const correspondingArticle = articleRows.find((article) => {
      if (article.title === comment.belongs_to) {
        return article;
      }
    });
    const newComment = {};
    newComment.user_id = correspondingUser.user_id;
    newComment.article_id = correspondingArticle.article_id;
    newComment.votes = comment.votes;
    newComment.created_at = new Date(comment.created_at);
    newComment.body = comment.body;
    newArray[index] = newComment;
    return newArray;
  }, []);
};
