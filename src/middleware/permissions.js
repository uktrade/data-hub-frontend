const { get } = require('lodash')

module.exports = (req, res, next) => {
  const permissions = get(res, 'locals.user.permissions')
  if (permissions) {
    res.locals.user.hasPermission = permissions.includes.bind(permissions)
  }
  next()
}
