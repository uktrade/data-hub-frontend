const { difference } = require('lodash')

const { NotFoundError } = require('./errors')

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
const allFeaturesOr404 = (...features) =>
  (req, res, next) =>
    next(
      difference(features, Object.keys(res.locals.features)).length &&
        new NotFoundError()
    )

module.exports = allFeaturesOr404
