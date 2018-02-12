const { assign } = require('lodash')

const searchCompanies = require('./search-companies')

function searchForeignCompanies (options) {
  const optionsUkBasedFalse = assign({}, options, { isUkBased: false })

  return searchCompanies(optionsUkBasedFalse)
}

module.exports = searchForeignCompanies
