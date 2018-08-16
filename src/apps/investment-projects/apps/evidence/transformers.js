/* eslint-disable camelcase */
const { compact, map } = require('lodash')

function isTag (key) {
  return key.search(/tag/i) !== -1
}

function transformedEvidenceFieldsRequest (fields) {
  const tags = compact(map(fields, (value, key) => isTag(key) ? fields[key] : null))
  const comment = fields.comment

  return {
    tags,
    comment,
  }
}

module.exports = {
  transformedEvidenceFieldsRequest,
}
