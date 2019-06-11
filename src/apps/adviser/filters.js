const { get, includes } = require('lodash')

function filterActiveAdvisers ({ advisers = [], includeAdviser = [] }) {
  includeAdviser = [...includeAdviser]
  return advisers.filter(adviser => {
    // This returns all active users plus the include advisor (whether they are active or not)
    return (
      get(adviser, 'is_active', true) ||
      includes(includeAdviser, adviser.id)
    )
  })
}
module.exports = {
  filterActiveAdvisers,
}
