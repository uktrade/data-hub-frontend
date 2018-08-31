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
  let output = {
    type: 'document',
  }

  switch (file.status) {
    case 'virus_scanned':
      if (file.av_clean) {
        output = {
          ...output,
          ...{
            status: 'av_clean',
            message: 'Download',
            href: `/investment-projects/${investment_project_id}/propositions/${proposition_id}/download/${file.id}`,
          },
        }
      } else {
        output = {
          ...output,
          ...{
            status: 'scan_failed',
            message: 'The file didn\'t pass virus scanning, contact your administrator',
          },
        }
      }

      break
    case 'not_virus_scanned':
      output.message = `File not virus scanned`
      break

    case 'virus_scanning_scheduled':
      output.message = `Virus scanning scheduled`
      break

    case 'virus_scanning_in_progress':
      output.message = `File is being scanned, try again in a few moments`
      break

    case 'virus_scanning_failed':
      output.message = `Virus scanning failed, contact your administrator`
      break

    default:
      output.message = `Virus scanning failed, contact your administrator`
      break
  }
  
  return output
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
