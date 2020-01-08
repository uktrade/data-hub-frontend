const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

const GLOBAL_NAV_ITEM = {}

const APP_PERMISSIONS = [GLOBAL_NAV_ITEM]

const PROPOSITION_STATE = {
  ongoing: 'Ongoing',
  abandoned: 'Abandoned',
  completed: 'Completed',
  late: 'Late',
}

module.exports = {
  GLOBAL_NAV_ITEM,
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  PROPOSITION_STATE,
}
