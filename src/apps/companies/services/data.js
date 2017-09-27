/**
 * Pass an API formatted company record in and return a path to view that company depending on company type
 *
 * @param {Object} company
 *
 * @returns {string} urlPath
 */
function buildCompanyUrl (company) {
  return `/companies/${company.id}`
}

module.exports = {
  buildCompanyUrl,
}
