import { server } from '..';
import request from 'supertest';
import { expect } from 'chai';

describe('express', function () {
  after(() => {
    server.close()
  })

  it('should respond with 200 for /status', async () => {
    const res = await request(server)
      .get('/status')
    expect(res.statusCode).to.equal(200)
  });

  it('should respond with 404 with non-existant routes', function testPath(done) {
    request(server)
      .get('/non-existant-path')
      .expect(404, done);
  });

  describe('basic auth', async() => {
    it('should respond with 200 when called with valid Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(200);
    });

    it('should respond with 401 when called with valid Authorization header value and user is not present', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: YXppdEBlbWFpbC5jb206UGFzc3dvcmQx');
      expect(res.statusCode).to.equal(401);
      expect(res.text).to.equal('Authentication required');
    });

    it('should respond with 401 when called with invalid Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: abcd');
      expect(res.statusCode).to.equal(401);
      expect(res.text).to.equal('Authentication required');
    });

    it('should respond with 401 when called with Authorization header value missing', async () => {
      const res = await request(server)
      .get('/basic-auth')
      expect(res.statusCode).to.equal(401);
      expect(res.text).to.equal('Authentication required');
    });
  })
});