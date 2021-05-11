let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

//Assertion
chai.should();

chai.use(chaiHttp);
let token;
let token_francesco;

describe('Autenticazione', () => {
  /**
   * Test registrazione
   */
  describe('POST /api/users', () => {
    it('Creazione utente da cancellare', (done) => {
      let body = {
        name: 'DA CANCELLARE',
        email: 'canc@gmail.com',
        password: 'mariorossi',
      };
      chai
        .request(server)
        .post('/api/users')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          token = res.body.token;
          done();
        });
    });

    /**
     * Test Login POST /api/auth
     */
    describe('POST /api/auth', () => {
      it('Login corretto', (done) => {
        let body = {
          email: 'francesco.manzoni1996@gmail.com',
          password: 'Prova1234@5',
        };
        chai
          .request(server)
          .post('/api/auth')
          .send(body)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            token_francesco = res.body.token;
            done();
          });
      });

      it('Password mancante', (done) => {
        let body = {
          email: 'francesco.manzoni1996@gmail.com',
          password: '',
        };
        chai
          .request(server)
          .post('/api/auth')
          .send(body)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });

      it('Password errata', (done) => {
        let body = {
          email: 'francesco.manzoni1996@gmail.com',
          password: 'afnanj',
        };
        chai
          .request(server)
          .post('/api/auth')
          .send(body)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    /**
     * Test Autenticazione GET /api/auth
     */
    describe('Autenticazione GET /api/auth', () => {
      it('Get auth utente', (done) => {
        chai
          .request(server)
          .get('/api/auth')
          .set('x-auth-token', token_francesco)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('_id')
              .eql('6044b254a5a0ed20ec7a9bef');
            done();
          });
      });
      it('Autenticazione con token errato', (done) => {
        chai
          .request(server)
          .get('/api/auth')
          .set('x-auth-token', '0')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });
  });

  //PROFILI
  describe('Test Api Profili', () => {
    /**
     * Ottieni Profilo utente loggato GET
     */
    describe('/api/profile/me', () => {
      it('Ottieni profilo utente loggato', (done) => {
        chai
          .request(server)
          .get('/api/profile/me')
          .set('x-auth-token', token_francesco)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            res.body.should.have
              .property('_id')
              .eql('6047c13fddbba444d0bb1940');
            res.body.should.have
              .property('user')
              .that.have.property('_id')
              .eql('6044b254a5a0ed20ec7a9bef');
            res.body.should.have.property('social');
            res.body.should.have.property('skills');
            res.body.should.have.property('experience');
            res.body.should.have.property('education');
            done();
          });
      });
    });
    /**
     * GET /Api/Profile
     */
    describe('/api/profile', () => {
      it('Ottieni tutti i profili', (done) => {
        chai
          .request(server)
          .get('/api/profile')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });

    /**
     * GET api/profile/user/:user_id  Ottieni profilo da id utente
     */
    describe('/api/profile', () => {
      it('Ottieni singolo profilo', (done) => {
        chai
          .request(server)
          .get('/api/profile/user/6044b254a5a0ed20ec7a9bef')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });
    /**
     * Creazione profilo
     */
    describe('POST /api/profile', () => {
      it('Aggiornamento o Creazione Profilo utente', (done) => {
        let body = {
          company: 'test company',
          status: 'test status ',
          skills: 'skill1, skill2, skill3',
        };
        chai
          .request(server)
          .post('/api/profile')
          .set('x-auth-token', token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });

    /**
     * Github test
     */

    describe('GET api/profile/github', () => {
      it('Test github api', (done) => {
        chai
          .request(server)
          .get('/api/profile/github/Francesco-Manzoni')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });

    let exp_id;
    describe('PUT /api/profile/experience', () => {
      it('Inserimento esperienza utente', (done) => {
        let body = {
          title: 'Libero professionista',
          company: 'Me stesso',
          location: 'Italia',
          from: '8-10-2015',
          current: true,
        };
        chai
          .request(server)
          .put('/api/profile/experience')
          .set('x-auth-token', token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');

            exp_id = res.body.experience[0]._id;
            done();
          });
      });
    });
    let edu_id;
    describe('PUT /api/profile/education', () => {
      it('Inserimento educazione utente', (done) => {
        let body = {
          title: 'Libero professionista',
          school: 'test',
          degree: 'test',
          fieldofstudy: 'test',
          from: '8-10-2019',
          current: true,
        };
        chai
          .request(server)
          .put('/api/profile/education')
          .set('x-auth-token', token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');

            edu_id = res.body.education[0]._id;

            done();
          });
      });
    });
    describe('DELETE /api/profile/experience', () => {
      it('Cancellazione esperienza', (done) => {
        chai
          .request(server)
          .delete('/api/profile/experience/' + exp_id)
          .set('x-auth-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });

    describe('DELETE /api/profile/education', () => {
      it('Cancellazione esperienza', (done) => {
        chai
          .request(server)
          .delete('/api/profile/education/' + edu_id)
          .set('x-auth-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
      });
    });
    describe('TEST POSTS', () => {
      let post_id;
      describe('GET api/posts', () => {
        it('Ottengo tutti i post', (done) => {
          chai
            .request(server)
            .get('/api/posts')
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              done();
            });
        });
      });

      describe('POST api/posts', () => {
        it('Creazione Post', (done) => {
          let body = {
            text: 'Post di prova',
          };
          chai
            .request(server)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              post_id = res.body._id;
              done();
            });
        });
      });

      describe('GET api/posts/:post_id', () => {
        it('Get post singolo', (done) => {
          chai
            .request(server)
            .get('/api/posts/' + post_id)
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              res.body.should.have.property('_id').eql(post_id);
              done();
            });
        });
      });

      describe('PUT api/posts/like/:post_id', () => {
        it('Like al post', (done) => {
          chai
            .request(server)
            .put('/api/posts/like/' + post_id)
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              done();
            });
        });
      });
      describe('PUT api/posts/unlike/:post_id', () => {
        it('Unike al post', (done) => {
          chai
            .request(server)
            .put('/api/posts/unlike/' + post_id)
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              done();
            });
        });
      });
      let comment_id;
      describe('POST api/posts/comment/:post_id', () => {
        it('Commento al post', (done) => {
          let body = {
            text: 'commento di prova',
          };
          chai
            .request(server)
            .post('/api/posts/comment/' + post_id)
            .set('x-auth-token', token)
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              comment_id = res.body[0]._id;
              done();
            });
        });
      });
      describe('DELETE api/posts/comment/:post_id/:comment_id', () => {
        it('Cancellazione commento al post', (done) => {
          chai
            .request(server)
            .delete('/api/posts/comment/' + post_id + '/' + comment_id)
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              done();
            });
        });
      });
      describe('DELETE /api/post/post_id', () => {
        it('Cancellazione post', (done) => {
          chai
            .request(server)
            .delete('/api/posts/' + post_id)
            .set('x-auth-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.a('Object');
              done();
            });
        });
      });
    });
    //DA FARE SEMPRE ALLA FINE
    /**
     * Cancellazione profilo, utente e posts
     */
    describe('DELETE /api/profile', () => {
      it('Cancellazione utente, profilo e posts', (done) => {
        chai
          .request(server)
          .delete('/api/profile')
          .set('x-auth-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('msg').eql('Utente eliminato');
            res.should.be.a('Object');
            done();
          });
      });
    });
  });
});
//describe('Test Api dei Posts', () => {})
