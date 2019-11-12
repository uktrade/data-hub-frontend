const { difference } = require('lodash')

class NotAuthorizedError extends Error {
  constructor () {
    super('Not Authorized')
    this.statusCode = 403
  }
}

/**
 * @function allPermissionsOr403
 * @description An Express middleware, that results in a 403 Not Authorized
 * if the user doesn't have all of the listed permissions.
 * @param {...permissions: string[]} features - A list of permissions flags.
 * @example
 * // Will throw a 403 if the user doesn't have permissions foo, bar and baz...
 * router.use('/only-for-foobarbaz', allFeaturesOr404('foo', 'bar', 'baz'))
 * // ...and the request will never get here.
 * router.get('/only-for-foobarbaz', handler)
 */
const allPermissionsOr403 = (...permissions) =>
  (req, res, next) =>
    next(
      difference(permissions, res.locals.user.permissions).length &&
        new NotAuthorizedError()
    )

module.exports = allPermissionsOr403
