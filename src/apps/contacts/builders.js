const { SORT_OPTIONS } = require('./constants')

function buildContactSorting (originalQuery = {}) {
  const query = Object.assign(
    {},
    { sortby: SORT_OPTIONS[0].value },
    originalQuery
  )

  return {
    options: SORT_OPTIONS,
    selected: query.sortby,
  }
}

module.exports = {
  buildContactSorting,
}
