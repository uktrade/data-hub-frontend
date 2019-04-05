/* eslint-disable camelcase */
const { assign, capitalize, get, mapKeys, pickBy } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const { transformFilesResultsToDetails, transformLabelsToShowFiles } = require('../documents/transformers')
const labels = require('./labels')
const { PROPOSITION_STATE } = require('./constants')

const isUrlRegex = '^(http|https)://'

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
  modified_on,
  deadline,
  adviser,
  details,
  files = {},
  id,
  investment_project,
  features,
}) {
  const detailLabels = labels.proposition
  const transformed = {
    scope: capitalize(scope),
    status: capitalize(status),
    created_on: {
      type: 'date',
      name: created_on,
    },
    modified_on: {
      type: 'date',
      name: modified_on,
    },
    deadline: {
      type: 'date',
      name: deadline,
    },
    adviser,
    details: (function () {
      const regex = new RegExp(isUrlRegex, 'i')

      if (regex.exec(details)) {
        return {
          url: details,
          name: details,
        }
      } else {
        return details
      }
    })(),
    ...transformFilesResultsToDetails(files.results, id, investment_project.id),
  }

  return pickBy(mapKeys(transformed, (value, key) => transformLabelsToShowFiles(key, detailLabels)))
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
