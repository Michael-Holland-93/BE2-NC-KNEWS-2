process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/topics', () => {
    const url = '/api/topics';
    it('GET responds with 200 and the topics are in the correct format', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.have.all.keys('slug', 'description');
      }));
    it('POST responds with 201 and topic is in the correct format', () => {
      const newTopic = {
        slug: 'darts',
        description: 'A game',
      };
      return request.post(url)
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an('array');
          expect(body.topic[0]).to.have.all.keys('slug', 'description');
        });
    });
    it('GET responds with 200 and all the articles about the given topic', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
      }));
  });
  describe('/users', () => {
    const url = '/api/users';
    it('GET responds with 200 and the users are in the correct format', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.be.an('array');
        expect(body.users[0]).to.have.all.keys('user_id', 'username', 'avatar_url', 'name');
      }));
    it('POST responds with 201 and user is in the correct format', () => {
      const newUser = {
        username: 'Mike',
        avatar_url: 'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg',
        name: 'Michael',
      };
      return request.post(url)
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          expect(body.user).to.be.an('array');
          expect(body.user[0]).to.have.all.keys('user_id', 'username', 'avatar_url', 'name');
        });
    });
  });
  xdescribe('/articles', () => {
    const url = '/api/articles';
    it('GET responds with 200 and the articles are in the correct format', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
      }));
    it('POST responds with 201 and article is in the correct format', () => {
      const newArticle = {
        title: 'Running a Node App',
        body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        votes: 1,
      };
      return request.post(url)
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.be.an('array');
          expect(body.article[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
        });
    });
  });
  xdescribe('/comments', () => {
    const url = '/api/comments';
    it('GET responds with 200 and the comments are in the correct format', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments[0]).to.have.all.keys('comment_id', 'user_id', 'article_id', 'votes', 'created_at', 'body');
      }));
    it('POST responds with 201 and comments is in the correct format', () => {
      const newArticle = {
        user_id: '',
        article_id: '',
        votes: '2',
        created_at: '',
        body: '',
      };
      return request.post(url)
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.be.an('array');
          expect(body.comment[0]).to.have.all.keys('comment_id', 'user_id', 'article_id', 'votes', 'created_at', 'body');
        });
    });
  });
});
