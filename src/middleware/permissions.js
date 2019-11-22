const { camelCase, has } = require('lodash')

module.exports = (req, res, next) => {
  if (has(res, 'locals.user.permissions')) {
    res.locals.user.hasPermission = res.locals.user.permissions.reduce(
      (a, x) => ({
        ...a,
        [camelCase(x)]: true,
      }),
      {},
    )
  }
  next()
}
