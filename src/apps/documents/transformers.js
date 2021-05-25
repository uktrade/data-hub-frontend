/* eslint-disable camelcase */

function isFileKey(key) {
  return key.search(/file/i) !== -1
}

function formatFileLabel(key) {
  return key.replace(/file/i, 'File ')
}

function transformLabelsToShowFiles(key, labels) {
  if (!isFileKey(key)) {
    return labels[key]
  } else {
    return formatFileLabel(key)
  }
}

function getDownloadLinkOrState(file, proposition_id, investment_project_id) {
  const items = {
    virus_scanned: ({ id, av_clean }) => {
      return av_clean
        ? {
            url: `/investments/projects/${investment_project_id}/propositions/${proposition_id}/download/${id}`,
            name: 'Download',
          }
        : {
            type: 'error',
            name: "The file didn't pass virus scanning, contact your administrator",
          }
    },
    not_virus_scanned: () => 'File not virus scanned',
    virus_scanning_scheduled: () => 'Virus scanning scheduled',
    virus_scanning_in_progress: () =>
      'File is being scanned, try again in a few moments',
    virus_scanning_failed: () =>
      'Virus scanning failed, contact your administrator',
  }

  return items[file.status](file)
}

function transformFilesResultsToDetails(
  files,
  proposition_id,
  investment_project_id
) {
  const obj = {}

  files.forEach((file, index) => {
    const downloadLinkOrState = getDownloadLinkOrState(
      file,
      proposition_id,
      investment_project_id
    )
    const key = files.length ? 'file' + (index + 1) : 'file'

    obj[key] = [file.original_filename, downloadLinkOrState]
  })

  return obj
}

module.exports = {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
}
