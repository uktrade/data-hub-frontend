/* eslint-disable camelcase */
const { mapKeys } = require('lodash')

function isFileKey (key) {
  return key.search(/file/i) !== -1
}

function formatFileLabel (key) {
  return key.replace(/file/i, 'File ')
}

function transformLabelsToShowFiles (key, labels) {
  if (!isFileKey(key)) {
    return labels[key]
  } else {
    return formatFileLabel(key)
  }
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
        output = 'The file didn\'t pass virus scanning, contact your administrator'
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

module.exports = {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
}
