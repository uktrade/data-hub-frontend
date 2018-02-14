/* eslint-disable camelcase */
const { compact, get } = require('lodash')

function getInvestmentTypeDetails (investment_type, fdi_type) {
  const types = [
    investment_type.name,
    get(fdi_type, 'name'),
  ]
  return compact(types).join(', ')
}

module.exports = {
  getInvestmentTypeDetails,
}
