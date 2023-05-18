/* eslint-disable camelcase */
const { assign } = require('lodash')

const { PROPOSITION_STATE } = require('./constants')

function transformPropositionToListItem({
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

function transformPropositionListItemToHaveUrlPrefix(urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, {
      urlPrefix:
        urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix,
    })
  }
}

module.exports = {
  transformPropositionToListItem,
  transformPropositionListItemToHaveUrlPrefix,
}
