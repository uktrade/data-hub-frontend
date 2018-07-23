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

module.exports = {
  filterDisabledOption,
}
