import { METHODS } from 'node:http';

const methods = METHODS.map(method => {
  return method.toUpperCase();
});

export interface OverrideMiddlewareOptions {
  /** methods allow to override, default is `[ 'POST' ]` */
  allowedMethods?: string[];
}

export type Next = () => Promise<void>;

export default (options: OverrideMiddlewareOptions = {}) => {
  options.allowedMethods = options.allowedMethods ?? [ 'POST' ];

  return function overrideMethod(ctx: any, next: Next) {
    const originalMethod = ctx.request.method;
    if (!options.allowedMethods?.includes(originalMethod)) {
      return next();
    }

    let method: string | undefined;
    // body support
    const body = ctx.request.body;
    if (body?._method && typeof body._method === 'string') {
      method = body._method.toUpperCase();
    } else {
      // header support
      const header = ctx.get('x-http-method-override');
      if (header) {
        method = header.toUpperCase();
      }
    }

    if (method) {
      // only allow supported methods
      // if you want to support other methods,
      // just create your own utility!
      if (!methods.includes(method)) {
        ctx.throw(400, `invalid override method: "${method}"`);
      }
      ctx.request.method = method;
    }

    return next();
  };
};
