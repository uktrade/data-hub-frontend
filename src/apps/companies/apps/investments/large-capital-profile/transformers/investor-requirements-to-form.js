/* eslint-disable camelcase */
const {
  checkOptionByMatchingId,
  checkOptionByFindingMatchingId,
} = require('../../utils/transformers')

const transformCheckboxes = (metadata, obj) => {
  return metadata.map(checkOptionByFindingMatchingId(obj.value)) // Array
}

const transformRadioButtons = (metadata, obj) => {
  return metadata.map(checkOptionByMatchingId(obj.value)) // String
}

module.exports = {
  transformCheckboxes,
  transformRadioButtons,
}
