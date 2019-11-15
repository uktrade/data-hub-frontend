const { camelCase, get } = require('lodash')

module.exports = (req, res, next) => {
  if (get(res, 'locals.user.permissions')) {
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
