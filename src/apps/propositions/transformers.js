/* eslint-disable camelcase */
const { assign, capitalize, get, mapKeys, pickBy } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const { transformFilesResultsToDetails, transformLabelsToShowFiles } = require('../documents/transformers')
const labels = require('./labels')
const { PROPOSITION_STATE } = require('./constants')

const isUrlRegex = '(http|https)://'

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

function formatDetails (details = '') {
  if (details.length) {
    return splitString(details).map(s => isUrl(s) ? addAnchorsToUrl(s) : addLineBreaks(s))
  }
}

function addLineBreaks (string) {
  if (string.match(/\n|\r/g)) {
    return {
      type: 'linebreak',
    }
  } else {
    return {
      type: 'word',
      string,
    }
  }
}

function isUrl (string) {
  return string.match(isUrlRegex)
}

function splitString (string) {
  /**
   * splits the string by space, and return caret
   */
  const separators = [' ', '\r']

  return string.split(new RegExp(separators.join('|'), 'g'))
}

function addAnchorsToUrl (s) {
  const string = s.replace(/\n|\r/g, '')

  return {
    type: 'link',
    string: {
      url: string,
      name: string,
    },
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
  const formattedDetails = formatDetails(details)
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
    details: formattedDetails ? {
      type: 'paragraph',
      string: formattedDetails,
    } : null,
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
