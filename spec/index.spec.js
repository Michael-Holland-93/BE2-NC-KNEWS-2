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
          expect(body.topic).to.be.an('object');
          expect(body.topic).to.have.all.keys('slug', 'description');
        });
    });
    describe('/:topic/articles', () => {
      it('GET responds with 200 and the articles are in the correct format and the correct limit is enforced', () => request.get('/api/topics/mitch/articles?limit=4')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.have.all.keys('title', 'article_id', 'votes', 'comment_count', 'created_at', 'author', 'topic');
          expect(body.articles.length).to.equal(4);
        }));
      it('GET responds with 200 and the articles skip the first article', () => request.get('/api/topics/mitch/articles?p=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Sony Vaio; or, The Laptop');
        }));
      it('GET responds with 200 and the articles are sorted by the title column', () => request.get('/api/topics/mitch/articles?sort_criteria=title')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Z');
        }));
      it('GET responds with 200 and the articles are sorted ascendingly', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
        .expect(200)
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
            expect(body.article).to.have.all.keys('article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at');
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
    it('GET responds with 200 and the user with the given username', () => request.get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).to.be.an('object');
        expect(body.user.username).to.equal('butter_bridge');
      }));
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
    it('GET responds with 200 and the articles are in the correct format', () => request.get('/api/articles?p=1')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].title).to.equal('Sony Vaio; or, The Laptop');
      }));
    it('GET responds with 200 and the articles are sorted by the title column', () => request.get('/api/topics/mitch/articles?sort_criteria=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
      }));
    it('GET responds with 200 and the articles are sorted ascendingly', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Moustache');
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
          expect(body.article).to.be.an('object');
          expect(body.article.votes).to.equal(1);
        })
        .then(() => request.patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(202)
          .then(({ body }) => {
            expect(body.article).to.be.an('object');
            expect(body.article.votes).to.equal(2);
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
        it('Get responds with 200 and all the comments in the correct format', () => request.get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0]).to.have.all.keys('comment_id', 'votes', 'created_at', 'body', 'author');
            expect(body.comments[0].comment_id).to.equal(2);
          }));
        it('Get responds with 200 and all the comments have the correct limit', () => request.get('/api/articles/1/comments?limit=3')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(3);
          }));
        it('Get responds with 200 and all the first comment has been excluded', () => request.get('/api/articles/1/comments?p=1')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0].comment_id).to.equal(3);
          }));
        it('Get responds with 200 and all the comments in the correct order', () => request.get('/api/articles/1/comments?sort_criteria=comment_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0].comment_id).to.equal(18);
          }));
        it('Get responds with 200 and all the comments in the correct order', () => request.get('/api/articles/1/comments?sort_ascending=true')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0].comment_id).to.equal(18);
          }));
        it('POST responds with 201 and the comment is in the correct format', () => {
          const newComment = {
            user_id: 1,
            body: 'posted comment',
          };
          return request.post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body.comment.user_id).to.equal(1);
              expect(body.comment.article_id).to.equal(1);
              expect(body.comment.body).to.equal('posted comment');
            });
        });
        describe('/:comment_Id', () => {
          it('PATCH responds with 202 and the votes updated', () => request.patch('/api/articles/1/comments/3')
            .send({ inc_votes: 2 })
            .expect(202)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(102);
            })
            .then(() => request.patch('/api/articles/1/comments/3')
              .send({ inc_votes: -1 })
              .expect(202)
              .then(({ body }) => {
                expect(body.comment.votes).to.equal(101);
              })));
          it('DELETE responds with 204 and an emoty object', () => request.delete('/api/articles/1/comments/3')
            .expect(204)
            .then(() => request.get('/api/articles/1/comments/3')
              .expect(404)));
          it('DELETE responds with 404 and a message saying comment does not exist', () => request.delete('/api/articles/1/comments/300')
            .expect(404)
            .then(({ body }) => {
              expect(body.message).to.equal('comment does not exist');
            }));
        });
      });
    });
  });
});
