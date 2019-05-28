/* eslint camelcase: 0 */

function transformActivityFeedSearchResults ({
  total,
  hits,
} = {}) {
  return {
    total,
    activities: hits.map(transformActivity),
  }
}

function transformActivity (hit) {
  return hit._source
}

module.exports = { transformActivityFeedSearchResults }
