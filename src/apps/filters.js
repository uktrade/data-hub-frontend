const { get, intersection } = require('lodash')

function filterDisabledOption ({ currentValue = null, createdOn } = {}) {
  const createdOnTime = Date.parse(createdOn) || Date.now()

  return function (item) {
    if (!item.disabled_on) {
      return true
    }

    const isDisabled = Date.parse(item.disabled_on) > createdOnTime
    const isCurrentValue = item.id === currentValue

    return (isDisabled || isCurrentValue)
  }
}

function filterNonPermittedItem (userPermissions) {
  return function (item) {
    const hasPermissions = get(item, 'permissions.length', 0)
    if (!hasPermissions) { return true }

    const isPermitted = intersection(item.permissions, userPermissions).length > 0
    return isPermitted
  }
}

module.exports = {
  filterDisabledOption,
  filterNonPermittedItem,
}
