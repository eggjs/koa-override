'use strict';

const assert = require('assert');
const request = require('supertest');
const koa = require('koa');
const bodyParser = require('koa-body-parser');
const override = require('../');

describe('override method middleware', () => {
  it('should override with x-http-method-override header', () => {
    const app = koa();
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
      };
    });

    return request(app.callback())
      .post('/foo')
      .set('X-Http-Method-Override', 'DELETE')
      .expect({
        method: 'DELETE',
        url: '/foo',
      })
      .expect(200);
  });

  it('should override with body._method', () => {
    const app = koa();
    app.use(bodyParser());
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
        body: this.request.body,
      };
    });

    return request(app.callback())
      .post('/foo')
      .send({
        _method: 'delete',
        haha: 'koa la',
      })
      .expect({
        method: 'DELETE',
        url: '/foo',
        body: {
          _method: 'delete',
          haha: 'koa la',
        },
      })
      .expect(200);
  });

  it('should throw invalid overriden method error', () => {
    const app = koa();
    app.on('error', function(err) {
      assert.equal(err.message, 'invalid overriden method: "SAVE"');
    });
    app.use(override());

    return request(app.callback())
      .post('/foo')
      .set('X-Http-Method-Override', 'SAVE')
      .expect('invalid overriden method: "SAVE"')
      .expect(400);
  });

  it('should dont override method on body._method and header both not match', () => {
    const app = koa();
    app.use(bodyParser());
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
        body: this.request.body,
      };
    });

    return request(app.callback())
      .post('/foo')
      .send({ foo: 'bar' })
      .set('X-Http-Method-Override-foo', 'DELETE')
      .expect({
        method: 'POST',
        url: '/foo',
        body: { foo: 'bar' },
      })
      .expect(200);
  });

  it('should not allow override with x-http-method-override header on GET request', () => {
    const app = koa();
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
      };
    });

    return request(app.callback())
      .get('/foo')
      .set('X-Http-Method-Override', 'DELETE')
      .expect({
        method: 'GET',
        url: '/foo',
      })
      .expect(200);
  });

  it('should not allow override with x-http-method-override header on PUT request', () => {
    const app = koa();
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
      };
    });

    return request(app.callback())
      .put('/foo')
      .set('X-Http-Method-Override', 'DELETE')
      .expect({
        method: 'PUT',
        url: '/foo',
      })
      .expect(200);
  });

  it('should custom options.allowedMethods work', () => {
    const app = koa();
    app.use(override({
      allowedMethods: [ 'POST', 'PUT' ],
    }));
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
      };
    });

    return request(app.callback())
      .put('/foo')
      .set('X-Http-Method-Override', 'DELETE')
      .expect({
        method: 'DELETE',
        url: '/foo',
      })
      .expect(200);
  });
});
