/* eslint-disable camelcase */
const { get, assign, mapKeys, pickBy} = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const labels = require('./labels')
const { PROPOSITION_STATE } = require('./constants')

// const transformEntityLink = (entity, entityPath, noLinkText = null) => {
//   return entity ? {
//     url: `/${entityPath}/${entity.id}`,
//     name: entity.name,
//   } : noLinkText
// }

// const transformDocumentsLink = (archived_documents_url_path) => {
//   if (archived_documents_url_path) {
//     return {
//       url: config.archivedDocumentsBaseUrl + archived_documents_url_path,
//       name: 'View files and documents',
//       hint: '(will open another website)',
//       hintId: 'external-link-label',
//     }
//   }
//
//   return { name: 'There are no files or documents' }
// }
function transformPropositionResponseToForm ({
  id,
  adviser,
  name,
  scope,
  deadline,
  investment_project,
} = {}) {
  if (!id) return null

  const isValidDate = isValid(new Date(deadline))

  return {
    id,
    name,
    scope,
    adviser: get(adviser, 'id'),
    deadline: {
      day: isValidDate ? format(deadline, 'DD') : '',
      month: isValidDate ? format(deadline, 'MM') : '',
      year: isValidDate ? format(deadline, 'YYYY') : '',
    },
    investment_project: get(investment_project, 'id'),
  }
}

function transformPropositionToListItem ({
  id,
  name,
  scope,
  kind,
  deadline,
  created_on,
  adviser,
  status,
}) {
  return {
    id,
    type: 'proposition',
    name: name || 'No subject',
    scope: scope || 'No scope',
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: PROPOSITION_STATE[status],
      },
      {
        label: 'Deadline',
        value: deadline,
        type: 'date',
      },
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

function transformPropositionResponseToViewRecord ({
  scope,
  status,
  created_on,
  deadline,
  adviser,
}) {
  const detailLabels = labels.proposition
  const transformed = {
    scope,
    status,
    created_on: {
      type: 'date',
      name: created_on,
    },
    deadline: {
      type: 'date',
      name: deadline,
    },
    adviser,
  }

  return pickBy(mapKeys(transformed, (value, key) => {
    return detailLabels[key]
  }))
}

function transformPropositionFormBodyToApiRequest (props) {
  return assign({}, props, {
    deadline: transformDateObjectToDateString('deadline')(props),
  })
}

function transformPropositionListItemToHaveUrlPrefix (urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, { urlPrefix: urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix })
  }
}

module.exports = {
  transformPropositionResponseToForm,
  transformPropositionToListItem,
  transformPropositionFormBodyToApiRequest,
  transformPropositionResponseToViewRecord,
  transformPropositionListItemToHaveUrlPrefix,
}
