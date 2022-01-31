/**
 * Get the page offset for the API.
 *
 * API is limited to a maxium of 10,000 items (usually 1,000 pages).
 */
const getPageOffset = ({ limit, page, maxItems = 10000 }) =>
  Math.min(limit * (page - 1), maxItems - limit) || 0

module.exports = { getPageOffset }
