/* eslint-disable camelcase */
const { compact, identity, map, pickBy } = require('lodash')

function isTag(key) {
  return key.search(/tag/i) !== -1
}

function transformedEvidenceTextFields(fields) {
  const tags = compact(
    map(fields, (value, key) => (isTag(key) ? fields[key] : null))
  )
  const comment = fields.comment

  return pickBy(
    {
      tags,
      comment,
    },
    identity
  )
}

module.exports = {
  transformedEvidenceTextFields,
}
