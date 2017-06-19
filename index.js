'use strict';

const methods = require('methods').map(method => {
  return method.toUpperCase();
});

module.exports = options => {
  options = options || {};
  options.allowedMethods = options.allowedMethods || [ 'POST' ];

  return function* overrideMethod(next) {
    const orginalMethod = this.request.method;
    if (options.allowedMethods.indexOf(orginalMethod) === -1) return yield next;

    let method;
    // body support
    const body = this.request.body;
    if (body && body._method) {
      method = body._method.toUpperCase();
    } else {
      // header support
      const header = this.get('x-http-method-override');
      if (header) {
        method = header.toUpperCase();
      }
    }

    if (method) {
      // only allow supported methods
      // if you want to support other methods,
      // just create your own utility!
      if (methods.indexOf(method) === -1) {
        this.throw(400, `invalid overriden method: "${method}"`);
      }
      this.request.method = method;
    }

    yield next;
  };
};
