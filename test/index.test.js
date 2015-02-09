/**!
 * koa-override - index.test.js
 *
 * Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   Jonathan Ong <me@jongleberry.com>
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var assert = require('assert');
var request = require('supertest');
var koa = require('koa');
var bodyParser = require('koa-body-parser');
var override = require('../');

describe('override method middleware', function () {
  it('should override with x-http-method-override header', function (done) {
    var app = koa();
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url
      };
    });

    request(app.listen())
    .post('/foo')
    .set('X-Http-Method-Override', 'DELETE')
    .expect({
      method: 'DELETE',
      url: '/foo'
    })
    .expect(200, done);
  });

  it('should override with body._method', function (done) {
    var app = koa();
    app.use(bodyParser());
    app.use(override());
    app.use(function* () {
      this.body = {
        method: this.method,
        url: this.url,
        body: this.request.body
      };
    });

    request(app.listen())
    .post('/foo')
    .send({
      _method: 'delete',
      haha: 'koa la'
    })
    .expect({
      method: 'DELETE',
      url: '/foo',
      body: {
        _method: 'delete',
        haha: 'koa la'
      }
    })
    .expect(200, done);
  });

  it('should throw invalid overriden method error', function (done) {
    var app = koa();
    app.on('error', function (err) {
      assert.equal(err.message, 'invalid overriden method: "SAVE"');
    });
    app.use(override());

    request(app.listen())
    .post('/foo')
    .set('X-Http-Method-Override', 'SAVE')
    .expect('invalid overriden method: "SAVE"')
    .expect(400, done);
  });
});
