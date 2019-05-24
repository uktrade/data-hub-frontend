/* eslint-disable camelcase */
const {
  transformObjectToOption,
  checkOptionByMatchingId,
  checkOptionByFindingMatchingId,
} = require('../../utils/transformers')

const transformCheckboxes = (metadata, obj) => {
  return metadata
    .map(transformObjectToOption)
    .map(checkOptionByFindingMatchingId(obj.value)) // Array
}

const transformRadioButtons = (metadata, obj) => {
  return metadata
    .map(transformObjectToOption)
    .map(checkOptionByMatchingId(obj.value)) // String
}

module.exports = {
  transformCheckboxes,
  transformRadioButtons,
}
