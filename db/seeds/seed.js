const {
  topicData, userData, articleData, commentData,
} = require('../data/development-data');

exports.seed = function (knex, Promise) {
  return knex('topics').del()
    .then(() => knex('users').del())
    .then(() => knex('articles').del())
    .then(() => knex('comments').del())
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then(() => knex('users').insert(userData).returning('*'))
    .then((userRows) => {
      const newArticleData = articleData.reduce((newArray, article, index) => {
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
      return Promise.all([knex('articles').insert(newArticleData).returning('*'), userRows]);
    })
    .then(([articleRows, userRows]) => {
      const newCommentData = commentData.reduce((newArray, comment, index) => {
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
      return knex('comments').insert(newCommentData).returning('*');
    });
};
