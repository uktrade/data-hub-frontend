const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    path: 'audit',
    label: 'Audit history',
  },
  {
    path: 'documents',
    label: 'Documents',
    permissions: [
      'company.read_contact_documents',
    ],
  },
]

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

module.exports = {
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
}
