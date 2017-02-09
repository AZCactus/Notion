const {expect} = require('chai');
const request = require('supertest');
const {User, db} = require('../../../../models');
const app = require('../../../../../server');

const seedUser = {
  first_name: 'Alvin',
  last_name : 'Yuen',
  email     : 'alvin@alvin.com',
  password  : '12345'
};

let seedUserId;

describe('Users GET Route:', () => {
  let userNum;
  it('should GET all users', () => {
    return request(app)
      .get('/api/user')
      .expect(200)
      .expect(res => {
        User
          .findAll()
          .then(users => {
            expect(res.body.length)
              .to
              .equal(users.length);
          });
      });
  });
});

describe('Users POST Route:', () => {

  it('should CREATE a user', () => {
    return request(app)
      .post('/api/user')
      .send(seedUser)
      .expect(200)
      .expect(res => {
        expect(res.body.email)
          .to
          .be
          .equal('alvin@alvin.com');
        seedUserId = res.body.id;
      });
  });

  it('should not allow to CREATE user with the same email', () => {
    return request(app)
      .post('/api/user')
      .send(seedUser)
      .expect(409);
  });

});

describe('Users DELETE Route:', () => {

  it('should delete a user', (done) => {
    return request(app)
      .delete(`/api/user/${seedUserId}`)
      .expect(204)
      .end((err, res) => {
        User.findById(seedUserId)
          .then(user => {
            expect(user).to.be.null;
            done();
          });
      });

  });
});
