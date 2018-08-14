/* eslint-disable camelcase */
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

function transformEvidenceResponseToForm (obj) {
  return obj
}

module.exports = {
  transformEvidenceResponseToForm,
  transformEvidenceToListItem,
}