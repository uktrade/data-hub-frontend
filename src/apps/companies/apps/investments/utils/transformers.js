const { find, isString, castArray, compact } = require('lodash')

const transformObjectToOption = ({ value, label }) => ({ value, text: label })

const checkMatchingItemById = (items) => {
  return obj => {
    if (find(items, (item) => item.id === obj.value)) {
      obj.checked = true
    }

    return obj
  }
}

const sanitizeCheckboxes = (selection) => {
  return isString(selection) ? castArray(selection) : compact(selection)
}

module.exports = {
  checkMatchingItemById,
  transformObjectToOption,
  sanitizeCheckboxes,
}
