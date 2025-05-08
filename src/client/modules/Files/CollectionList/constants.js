export const SORT_OPTIONS = [
  { value: '-created_on', name: 'Recently created' },
  { value: 'created_on', name: 'Oldest' },
]

export const DOCUMENT_TYPES = {
  SHAREPOINT: {
    type: 'documents.sharepointdocument',
    label: 'SharePoint link',
  },
  UPLOADABLE: {
    type: 'documents.uploadabledocument',
    label: 'Uploaded file',
  },
}

export const RELATED_OBJECT_TYPES = {
  COMPANY: 'company.company',
}
