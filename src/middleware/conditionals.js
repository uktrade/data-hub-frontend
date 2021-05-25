const { difference } = require('lodash')

const { NotAuthorizedError, NotFoundError } = require('./errors')

/**
 * @function allFeaturesOr404
 * @description An Express middleware, that results in a 404 Not Found error
 * if all the listed feature flags are not active.
 * @param {...features: string[]} features - A list of feature flags.
 * @example
 * // Will throw a 404 if features foo, bar and baz are not all active...
 * router.use('/feature-foobarbaz', allFeaturesOr404('foo', 'bar', 'baz'))
 * // ...and the request will never get here.
 * router.get('/feature-foobarbaz', handler)
 */
const allFeaturesOr404 =
  (...features) =>
  (req, res, next) =>
    next(
      difference(features, Object.keys(res.locals.features)).length &&
        new NotFoundError()
    )

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
const allPermissionsOr403 =
  (...permissions) =>
  (req, res, next) =>
    next(
      difference(permissions, res.locals.user.permissions).length &&
        new NotAuthorizedError()
    )

module.exports = {
  allFeaturesOr404,
  allPermissionsOr403,
}
