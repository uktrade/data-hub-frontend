const Layer = require('express/lib/router/layer')

const { NotFoundError } = require('./errors')

/**
 * An express middleware factory which adds `basePath` to `res.locals`.
 * It must be applied in front of a controller but after the route definition.
 * This is needed when you want to combine Express and client side SPA routing
 * e.g. React Router. The routing solution in the browser needs to know what
 * is the _base path_ i.e. the portion of th path managed by Express.
 * @param {string} path - An Express path definition
 * @returns An Express middleware
 * @example
 * // Imagine that we want to have an SPA served at the /foo/:id Express route,
 * // we also want to allow other express
 * // and we want
 * app.get(
 *   ['/foo/:id/bar', '/foo/:id/baz'],
 *   spaBasePath('/foo'),
 *   controller,
 * )
 */
module.exports = (path) => (req, res, next) => {
  const layer = new Layer(path + '*', {}, () => {})
  if (layer.match(req.path)) {
    // We need to remove the trailing part of the path configured in the express
    // route with a trailing asterisk (*), which is always stored in req.params[0]
    const basePath =
      req.originalUrl.slice(0, -layer.params[0].length) || req.originalUrl

    if (basePath && !(basePath === '/' || basePath.match(/^\/.*[^/]$/))) {
      throw Error(
        `Misformatted basePath "${res.locals.basePath}"! ` +
          'The basePath must start and must not end with a slash "/".'
      )
    }
    res.locals.basePath = basePath
    return next()
  }
  next(new NotFoundError())
}
