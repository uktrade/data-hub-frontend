const { get, intersection } = require('lodash')

function filterNonPermittedItem (userPermissions) {
  return function (item) {
    const hasPermissions = get(item, 'permissions.length', 0)
    if (!hasPermissions) { return true }

    const isPermitted = intersection(item.permissions, userPermissions).length > 0
    return isPermitted
  }
}

module.exports = {
  filterNonPermittedItem,
}
