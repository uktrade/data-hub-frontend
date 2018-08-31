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
  switch (file.status) {
    case 'virus_scanned':

      if (file.av_clean) {
        return `
            <a href="/investment-projects/${investment_project_id}/propositions/${proposition_id}/download/${file.id}">Download</a>
        `
      } else {
        return 'The file didn\'t pass virus scanning, contact your administrator'
      }

    case 'not_virus_scanned':
      return 'File not virus scanned'

    case 'virus_scanning_scheduled':
      return 'Virus scanning scheduled'

    case 'virus_scanning_in_progress':
      return 'File is being scanned, try again in a few moments'

    case 'virus_scanning_failed':
      return 'Virus scanning failed, contact your administrator'

    default:
      return 'Virus scanning failed, contact your administrator'
  }
}

function transformFilesResultsToDetails (files, proposition_id, investment_project_id) {
  let obj = {}

  mapKeys(files, (file, index) => {
    const downloadLinkOrState = getDownloadLinkOrState(file, proposition_id, investment_project_id)
    const key = files.length ? 'file' + (index + 1) : 'file'

    obj[key] = [file.original_filename, downloadLinkOrState]
  })

  return obj
}

module.exports = {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
}
