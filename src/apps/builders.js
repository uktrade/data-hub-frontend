const get = require('lodash/get')

function buildSortObject (sortOptions = [], originalQuery = {}) {
  const initialSortValue = get(sortOptions, '0.value')

  const query = Object.assign(
    {},
    { sortby: initialSortValue },
    originalQuery
  )

  return {
    options: sortOptions,
    selected: query.sortby,
  }
}

module.exports = {
  buildSortObject,
}
