/* eslint-disable camelcase */
const { compact, get, isNull } = require('lodash')

function getInvestmentTypeDetails (investment_type, fdi_type) {
  const types = [
    investment_type.name,
    get(fdi_type, 'name'),
  ]
  return compact(types).join(', ')
}

function formatCurrency (number) {
  if (isNull(number)) { return null }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(number)
}

module.exports = {
  formatCurrency,
  getInvestmentTypeDetails,
}
