const {
  topicData, userData, articleData, commentData,
} = require('../data/index');
const { newArticle } = require('../utilities/newArticleData');
const { newComment } = require('../utilities/newCommentData');

exports.seed = function (knex, Promise) {
  return knex('topics').del()
    .then(() => knex('users').del())
    .then(() => knex('articles').del())
    .then(() => knex('comments').del())
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then(() => knex('users').insert(userData).returning('*'))
    .then((userRows) => {
      const newArticleData = newArticle(userRows);
      return Promise.all([knex('articles').insert(newArticleData).returning('*'), userRows]);
    })
    .then(([articleRows, userRows]) => {
      const newCommentData = newComment(articleRows, userRows);
      return knex('comments').insert(newCommentData).returning('*');
    });
};
