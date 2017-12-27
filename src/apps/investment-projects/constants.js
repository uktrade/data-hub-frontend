const currentYear = (new Date()).getFullYear()

const LOCAL_NAV = [
  { path: 'details', label: 'Project details' },
  { path: 'team', label: 'Project team' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'evaluation', label: 'Evaluations' },
  { path: 'audit', label: 'Audit history' },
  { path: 'documents', label: 'Documents' },
]

const DEFAULT_COLLECTION_QUERY = {
  estimated_land_date_after: `${currentYear}-04-05`,
  estimated_land_date_before: `${currentYear + 1}-04-06`,
  sortby: 'estimated_land_date:asc',
}

module.exports = {
  LOCAL_NAV,
  DEFAULT_COLLECTION_QUERY,
}
