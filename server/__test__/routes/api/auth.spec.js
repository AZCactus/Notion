const {expect} = require('chai');
const request = require('supertest');
const {User, db} = require(',../../../models');
const app = require('../../../../server');


describe('Users Auth Route:', () => {
  let userId;
  const seedUser = {
    email   : 'ada@lovelace.com',
    password: '12345'
  };

  it('should allow a user to login', () => {
    return request(app)
      .post('/api/auth')
      .send(seedUser)
      .expect(200)
      .expect(res => {
        expect(res.body.email).to.equal('ada@lovelace.com');
        userId = res.body.id;
      });
  });

  it('should return unauthorized(401) if user does not exist', () => {
    const nonUser = {
      email   : 'alvin@yuen.com',
      password: '12345'
    };
    return request(app)
      .post('/api/auth')
      .send(nonUser)
      .expect(401);
  });

});
