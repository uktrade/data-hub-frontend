export const SORT_OPTIONS = [
  { value: '-created_on', name: 'Recently created' },
  { value: 'created_on', name: 'Oldest' },
]

export const DOCUMENT_TYPES = {
  SHAREPOINT: {
    type: 'documents.sharepointdocument',
    label: 'Add a new SharePoint link',
  },
  UPLOADABLE: { type: 'documents.uploadable', label: 'Upload a new doucment' },
}

export const RELATED_OBJECT_TYPES = {
  COMPANY: 'company.company',
}
