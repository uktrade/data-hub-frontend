const {
  get,
  includes,
  castArray,
  compact,
} = require('lodash')

function filterActiveAdvisers ({ advisers = [], includeAdviser }) {
  let adviserIds = compact(castArray(includeAdviser))
  return advisers.filter(adviser => {
    // This returns all active users plus the include advisor (whether they are active or not)
    return (
      get(adviser, 'is_active', true) ||
      includes(adviserIds, adviser.id)
    )
  })
}
module.exports = {
  filterActiveAdvisers,
}
