const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

const GLOBAL_NAV_ITEM = {
  path: '/events',
  label: 'Events',
  permissions: [
    'event.read_event',
  ],
  order: 3,
}

const APP_PERMISSIONS = [ GLOBAL_NAV_ITEM ]

const LOCAL_NAV = [
  {
    path: 'details',
    label: 'Details',
    permissions: [
      'event.read_event',
    ],
  },
]

module.exports = {
  GLOBAL_NAV_ITEM,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  LOCAL_NAV,
}
