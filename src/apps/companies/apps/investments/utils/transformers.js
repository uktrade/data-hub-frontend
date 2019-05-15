const { find, isString } = require('lodash')

const transformObjectToOption = ({ value, label }) => ({ value, text: label })

const checkMatchingItemById = (items) => {
  return obj => {
    if (find(items, (item) => item.id === obj.value)) {
      obj.checked = true
    }

    return obj
  }
}

const ifStringAddToEmtpyArray = (obj) => {
  return isString(obj) ? [obj] : obj
}

const sanitizeCheckboxes = (selection) => {
  return selection === undefined ? [] : ifStringAddToEmtpyArray(selection)
}

module.exports = {
  checkMatchingItemById,
  transformObjectToOption,
  sanitizeCheckboxes,
}
