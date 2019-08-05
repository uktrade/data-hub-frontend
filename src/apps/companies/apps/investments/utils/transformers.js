const { find, isString, castArray, compact } = require('lodash')

const transformObjectToOption = ({ value, label }) => ({ value, text: label })

const checkOptionByFindingMatchingId = (items) => {
  return option => {
    if (find(items, (item) => item.id === option.value)) {
      option.checked = true
    }

    return option
  }
}

const checkOptionByMatchingId = (id) => {
  return option => {
    if (option.value === id) {
      option.checked = true
    }

    return option
  }
}

const sanitiseUserSelection = (selection) => {
  return isString(selection) ? castArray(selection) : compact(selection)
}

module.exports = {
  sanitiseUserSelection,
  transformObjectToOption,
  checkOptionByMatchingId,
  checkOptionByFindingMatchingId,
}
