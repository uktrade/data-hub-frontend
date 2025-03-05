import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'
import { DOCUMENT_TYPES } from './constants'

export const transformFileToListItem = () => (file) => {
  let title = ''
  const links = []
  let summaryRows = []

  // Check if document type is SharePoint-related
  switch (file.document_type) {
    case DOCUMENT_TYPES.SHAREPOINT:
      title = 'SharePoint link'
      if (file.document.title) {
        title += ` - ${file.document.title}`
      }

      // Add links
      links.push(
        {
          text: 'View file (opens in new tab)',
          url: file.document.url,
          attrs: { target: '_blank', rel: 'noopener noreferrer' },
        },
        { text: 'Delete', url: '#' }
        // TODO: Handle that when delete is clicked you go to the delete flow.
      )

      // Add summary rows
      summaryRows = [
        {
          label: 'Date added',
          value: formatDate(
            file.document.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          ),
        },
        { label: 'Added by', value: file.created_by.name },
        { label: 'SharePoint url', value: file.document.url },
      ]
    case DOCUMENT_TYPES.FILE_UPLOAD:
    // TODO: Handle flow for uploaded files.
    default:
  }

  return {
    id: file.id,
    title,
    links,
    rows: summaryRows,
  }
}

export const transformResponseToCollection = (
  file,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformFileToListItem(file)),
})
