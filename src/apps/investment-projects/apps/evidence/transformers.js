/* eslint-disable camelcase */
const { compact, map } = require('lodash')

const { transformFilesResultsToDetails } = require('../../../document-upload/transformers')

function isTag (key) {
  return key.search(/tag/i) !== -1
}

function transformEvidenceToListItem ({
  id,
  title,
  adviser,
  created_on,
}) {
  return {
    id,
    type: 'evidence',
    name: title || 'No subject',
    meta: [
      {
        label: 'Created On',
        value: created_on,
        type: 'date',
      },
      {
        label: 'Adviser',
        value: adviser,
      },
    ],
  }
}

function transformedEvidenceFieldsRequest (fields) {
  const tags = compact(map(fields, (value, key) => isTag(key) ? fields[key] : null))
  const comment = fields.comment

  console.log(tags)

  return {
    tags,
    comment,
  }
}

function transformEvidenceResponseToForm (obj) {
  return obj
}

function transformEvidenceResponseToViewRecord (evidence) {

  // transformFilesResultsToDetails(files.results, id, investment_project.id)
}

module.exports = {
  transformedEvidenceFieldsRequest,
  transformEvidenceResponseToViewRecord,
  transformEvidenceResponseToForm,
  transformEvidenceToListItem,
}
