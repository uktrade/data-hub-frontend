const { get } = require('lodash')

function filterActiveAdvisers ({ advisers = [], includeAdviser }) {
  return advisers.filter((adviser) => {
    return get(adviser, 'is_active', true) || adviser.id === includeAdviser
  })
}
module.exports = {
  filterActiveAdvisers,
}
