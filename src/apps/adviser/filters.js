const { get, includes } = require('lodash')

function filterActiveAdvisers ({ advisers = [], includeAdviser }) {
  return advisers.filter(adviser => {
    // This returns all active users plus the include advisor (whether they are active or not)
    return (
      get(adviser, 'is_active', true) ||
      adviser.id === includeAdviser ||
      includes(includeAdviser, adviser.id)
    )
  })
}
module.exports = {
  filterActiveAdvisers,
}
