import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'

export const transformArchivedToApi = (archived) =>
  archived?.length === 1 ? archived[0] === 'true' : undefined

export const transformContactToListItem = () => (file) => {
  let title = ''
  const links = []
  let summaryRows = []

  // Check if document type is SharePoint-related
  if (file.document_type === 'documents.sharepointdocument') {
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
  } else {
    // TODO: Handle flow for uploaded files.
  }

  return {
    id: file.id,
    title,
    links,
    rows: summaryRows,
  }
}

export const transformResponseToCollection = (
  companyId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformContactToListItem(companyId)),
})
