const { getOptions } = require('../../../../../lib/options')
const { getAdvisers } = require('../../../../adviser/repos')

const DO_NOT_SORT = { sorted: false }

const getInvestorDetailsOptions = (token) => {
  return [
    getOptions(token, 'capital-investment/investor-type'),
    getOptions(token, 'capital-investment/required-checks-conducted'),
    getAdvisers(token),
  ]
}

const getInvestorRequirementsOptions = (token) => {
  return [
    getOptions(token, 'capital-investment/deal-ticket-size', DO_NOT_SORT),
    getOptions(token, 'capital-investment/large-capital-investment-type'),
    getOptions(token, 'capital-investment/time-horizon', DO_NOT_SORT),
    getOptions(token, 'capital-investment/restriction', DO_NOT_SORT),
    getOptions(token, 'capital-investment/construction-risk', DO_NOT_SORT),
    getOptions(token, 'capital-investment/equity-percentage', DO_NOT_SORT),
    getOptions(token, 'capital-investment/desired-deal-role', DO_NOT_SORT),
  ]
}

module.exports = {
  getInvestorDetailsOptions,
  getInvestorRequirementsOptions,
}
