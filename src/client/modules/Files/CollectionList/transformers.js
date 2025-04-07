import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'
import { DOCUMENT_TYPES } from './constants'

export const transformFileToListItem = () => (file) => {
  let title = ''
  const links = []
  let summaryRows = []

  // Function to format the summary rows
  const addSummaryRow = (label, value) => ({ label, value })

  // Handle different document types
  switch (file.document_type) {
    case DOCUMENT_TYPES.SHAREPOINT.type:
      title = 'SharePoint link'
      if (file.document.title) {
        title += ` - ${file.document.title}`
      }

      // Add links for SharePoint document
      links.push(
        {
          text: 'View file (opens in new tab)',
          url: file.document.url,
          attrs: { target: '_blank', rel: 'noopener noreferrer' },
        },
        {
          text: 'Delete',
          url: `/files/${file.id}/delete?related_object_id=${file.related_object_id}&related_object_type=${file.related_object_type}&document_type=${file.document_type}`,
        }
      )

      // Add summary rows for SharePoint document
      summaryRows = [
        addSummaryRow(
          'Date added',
          formatDate(file.document.created_on, DATE_FORMAT_MEDIUM_WITH_TIME)
        ),
        addSummaryRow('Added by', file?.created_by?.name),
        addSummaryRow('SharePoint url', file?.document?.url),
      ]
      break
    default:
      break
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
