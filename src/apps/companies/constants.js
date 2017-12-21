const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
  },
  {
    path: 'contacts',
    label: 'Contacts',
    permissions: [
      'company.read_contact',
    ],
  },
  {
    path: 'interactions',
    label: 'Interactions',
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    path: 'exports',
    label: 'Export',
  },
  {
    path: 'investments',
    label: 'Investment',
    permissions: [
      'investment.read_all_investmentproject',
      'investment.read_associated_investmentproject',
    ],
  },
  {
    path: 'orders',
    label: 'Orders (OMIS)',
    permissions: [
      'order.read_order',
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
      'company.read_company_document',
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
