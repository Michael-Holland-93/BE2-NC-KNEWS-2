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
    describe('/:topic/articles', () => {
      it('GET responds with 200 and the articles are in the correct format and the correct limit is enforced', () => request.get('/api/topics/mitch/articles?limit=4')
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.have.all.keys('title', 'article_id', 'votes', 'comment_count', 'created_at', 'author', 'topic');
          expect(body.articles.length).to.equal(4);
        }));
      it('GET responds with 200 and the articles skip the first article', () => request.get('/api/topics/mitch/articles?p=1')
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Sony Vaio; or, The Laptop');
        }));
      it('GET responds with 200 and the articles are sorted by the title column', () => request.get('/api/topics/mitch/articles?sort_criteria=title')
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Z');
        }));
      it('GET responds with 200 and the articles are sorted ascendingly', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Moustache');
        }));
      it('POST responds with 201 and the article is in the correct format', () => {
        const newArticle = {
          title: 'The history of football',
          body: 'Some text about football history',
          user_id: '1',
        };
        return request.post('/api/topics/cats/articles')
          .send(newArticle)
          .then(({ body }) => {
            expect(body.article[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
          });
      });
    });
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
  describe('/articles', () => {
    const url = '/api/articles';
    it('GET responds with 200 and the articles are in the correct format', () => request.get(url)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.all.keys('author', 'article_id', 'title', 'comment_count', 'votes', 'topic', 'created_at');
      }));
    it('GET responds with 200 and the articles are in the correct format', () => request.get('/api/articles?limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles.length).to.equal(2);
      }));
    it.only('GET responds with 200 and the articles are in the correct format', () => request.get('/api/articles?p=1')
      .expect(200)
      .then(({ body }) => {
        console.log(body.articles);
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].title).to.equal('Sony Vaio; or, THE Laptop');
      }));
    describe('/:article_id', () => {
      it('Get responds with 200 and the corresponding article', () => {
        request.get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(1);
            expect(body.articles[0].article_id).to.equal(1);
          });
      });
      it('PATCH responds with 202 and the corresponding updated article', () => request.patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article.length).to.equal(1);
          expect(body.article[0].votes).to.equal(1);
        })
        .then(() => request.patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(202)
          .then(({ body }) => {
            expect(body.article.length).to.equal(1);
            expect(body.article[0].votes).to.equal(2);
          })));
      it('DELETE responds with 204 and an empty articles array', () => request.delete('/api/articles/1')
        .expect(204)
        .then(() => request.get('/api/articles/1')
          .expect(404)));
      it('DELETE responds with 404 and a message saying article does not exist', () => request.delete('/api/articles/100')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal('article does not exist');
        }));
      describe('/comments', () => {
        it('', () => {

        });
      });
    });
    // it('POST responds with 201 and article is in the correct format', () => {
    //   const newArticle = {
    //     title: 'Running a Node App',
    //     body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
    //     votes: 1,
    //   };
    //   return request.post(url)
    //     .send(newArticle)
    //     .expect(201)
    //     .then(({ body }) => {
    //       expect(body.article).to.be.an('array');
    //       expect(body.article[0]).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
    //     });
    // });
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
