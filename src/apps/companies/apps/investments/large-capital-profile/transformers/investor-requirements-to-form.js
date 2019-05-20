/* eslint-disable camelcase */
const { transformObjectToOption, checkMatchingItemById } = require('../../utils/transformers')

const transformCheckboxes = (metaData, obj) => {
  return metaData
    .map(transformObjectToOption)
    .map(checkMatchingItemById(obj.value))
}

module.exports = {
  transformCheckboxes,
}
