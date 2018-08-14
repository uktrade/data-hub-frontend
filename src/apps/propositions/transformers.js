/* eslint-disable camelcase */
const { assign, capitalize, get, mapKeys, pickBy } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const labels = require('./labels')
const { PROPOSITION_STATE } = require('./constants')

const isUrlRegex = '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$'

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
  files,
  id,
  investment_project,
}) {
  const detailLabels = labels.proposition
  let transformed = {
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
  }

  transformed = {
    ...transformed,
    ...transformFilesResultsToDetails(files.results, id, investment_project.id),
  }

  return pickBy(mapKeys(transformed, (value, key) => {
    if (!isFileKey(key)) {
      return detailLabels[key]
    } else {
      return fileLabel(key)
    }
  }))
}

function isFileKey (key) {
  return key.search(/file/i) !== -1
}

function fileLabel (key) {
  return key.replace(/file/i, 'File ')
}

function getDownloadLinkOrState (file, proposition_id, investment_project_id) {
  const status = file.status
  let output = ''

  switch (status) {
    case 'virus_scanned':

      if (file.av_clean) {
        output = `
            <a href="/investment-projects/${investment_project_id}/propositions/${proposition_id}/download/${file.id}">Download</a>
        `
      } else {
        output = 'Virus found! You must contact your administrator right away'
      }

      break

    case 'not_virus_scanned':
      output = 'File not virus scanned'
      break

    case 'virus_scanning_scheduled':
      output = 'Virus scanning scheduled'
      break

    case 'virus_scanning_in_progress':
      output = 'File is being scanned, try again in a few moments'
      break

    case 'virus_scanning_failed':
      output = 'Virus scanning failed, contact your administrator'
      break

    default:
      output = 'Virus scanning failed, contact your administrator'
      break
  }

  return output
}

function transformFilesResultsToDetails (files, proposition_id, investment_project_id) {
  let obj = {}

  mapKeys(files, (file, index) => {
    const downloadLinkOrState = getDownloadLinkOrState(file, proposition_id, investment_project_id)
    let key = 'file'
    let counter = parseInt(index) + 1

    if (files.length > 0) {
      key = `${key}${counter}`
    }

    obj[key] = [file.original_filename, downloadLinkOrState]
  })

  return obj
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
