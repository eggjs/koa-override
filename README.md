# koa-override

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![CI](https://github.com/eggjs/koa-override/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eggjs/koa-override/actions?query=branch%3Amaster)
[![Coverage](https://img.shields.io/codecov/c/github/eggjs/koa-override.svg?style=flat-square)](https://codecov.io/gh/eggjs/koa-override)

[npm-image]: https://img.shields.io/npm/v/koa-override.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-override
[download-image]: https://img.shields.io/npm/dm/koa-override.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-override

Method override middleware.
Let you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

Refactor from [koa-override-method#5](https://github.com/koajs/override-method/pull/5)

## Install

```bash
npm install koa-override --save
```

## Usage

```ts
import bodyParser from 'koa-bodyparser';
import override from 'koa-override';

app.use(bodyParser());
app.use(override());
```

## API

### const mw = override([options])

If `body` exists, check `body._method` first.
Otherwise check `X-HTTP-Method-Override` header.

If there is no override parameter, then it's simply `this.request.method`.
You shouldn't use this unless you know you're using override.

- `options.allowedMethods = [ 'POST' ]` Only allowed override method on `POST` request.

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=eggjs/koa-override)](https://github.com/eggjs/koa-override/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
