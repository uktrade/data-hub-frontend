const { getOptions } = require('../../../../../lib/options')
const { getAdvisers } = require('../../../../adviser/repos')

const getInvestorDetailsOptions = (token) => {
  return [
    getOptions(token, 'capital-investment/investor-type'),
    getOptions(token, 'capital-investment/required-checks-conducted'),
    getAdvisers(token),
  ]
}

const getInvestorRequirementsOptions = (token) => {
  const doNotSort = { sorted: false }
  return [
    getOptions(token, 'capital-investment/deal-ticket-size', doNotSort),
    getOptions(token, 'capital-investment/large-capital-investment-type'),
    getOptions(token, 'capital-investment/time-horizon', doNotSort),
    getOptions(token, 'capital-investment/restriction', doNotSort),
    getOptions(token, 'capital-investment/construction-risk', doNotSort),
    getOptions(token, 'capital-investment/desired-deal-role', doNotSort),
  ]
}

module.exports = {
  getInvestorDetailsOptions,
  getInvestorRequirementsOptions,
}
