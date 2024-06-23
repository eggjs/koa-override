import { strict as assert } from 'node:assert';
import request from 'supertest';
import Koa from '@eggjs/koa';
import bodyParser from 'koa-bodyparser';
import override from '../src/index.js';

describe('override method middleware', () => {
  it('should override with x-http-method-override header', () => {
    const app = new Koa();
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
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
    const app = new Koa();
    app.use((bodyParser as any)());
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
        body: ctx.request.body,
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

  it('should ignore non string value on body._method', () => {
    const app = new Koa();
    app.use((bodyParser as any)());
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
        body: ctx.request.body,
      };
    });

    return request(app.callback())
      .post('/foo')
      .send({
        _method: 123,
        haha: 'koa la',
      })
      .expect({
        method: 'POST',
        url: '/foo',
        body: {
          _method: 123,
          haha: 'koa la',
        },
      })
      .expect(200);
  });

  it('should throw invalid override method error', () => {
    const app = new Koa();
    app.on('error', function(err) {
      assert.equal(err.message, 'invalid override method: "SAVE"');
    });
    app.use(override());

    return request(app.callback())
      .post('/foo')
      .set('X-Http-Method-Override', 'SAVE')
      .expect('invalid override method: "SAVE"')
      .expect(400);
  });

  it('should don\'t override method on body._method and header both not match', () => {
    const app = new Koa();
    app.use((bodyParser as any)());
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
        body: ctx.request.body,
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
    const app = new Koa();
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
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
    const app = new Koa();
    app.use(override());
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
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
    const app = new Koa();
    app.use(override({
      allowedMethods: [ 'POST', 'PUT' ],
    }));
    app.use(ctx => {
      ctx.body = {
        method: ctx.method,
        url: ctx.url,
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
