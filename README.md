koa-override
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-override.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-override
[travis-image]: https://img.shields.io/travis/node-modules/koa-override.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/koa-override
[coveralls-image]: https://img.shields.io/coveralls/node-modules/koa-override.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/koa-override?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/node-modules/koa-override.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/koa-override
[download-image]: https://img.shields.io/npm/dm/koa-override.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-override

Method override middleware.
Let you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

Refactor from [koa-override-method#5](https://github.com/koajs/override-method/pull/5)

## Install

```bash
$ npm install koa-override --save
```

## Usage

```js
var bodyParser = require('koa-body-parser')
var override = require('koa-override')

app.use(bodyParser())
app.use(override())
```

## API

### var mw = override()

If `body` exists, check `body._method` first.
Otherwise check `X-HTTP-Method-Override` header.

If there is no override parameter, then it's simply `this.request.method`.
You shouldn't use this unless you know you're using override.

## License

[MIT](./LICENSE)
