const { transformObjectToGovUKOption } = require('../../../../../apps/transformers')
const { transformAssetClasses } = require('./transformers')
const { getOptions } = require('../../../../../lib/options')
const { getAdvisers } = require('../../../../adviser/repos')

const OPTIONS = {
  sorted: false,
  transformer: transformObjectToGovUKOption,
}

const getInvestorDetailsOptions = (token) => {
  return [
    getOptions(token, 'capital-investment/investor-type', OPTIONS),
    getOptions(token, 'capital-investment/required-checks-conducted', OPTIONS),
    getAdvisers(token),
  ]
}

const getInvestorRequirementsOptions = (token) => {
  return [
    getOptions(token, 'capital-investment/deal-ticket-size', OPTIONS),
    getOptions(token, 'capital-investment/asset-class-interest', {
      transformer: transformAssetClasses,
    }),
    getOptions(token, 'capital-investment/large-capital-investment-type', {
      sortPropertyName: 'text',
      transformer: transformObjectToGovUKOption,
    }),
    getOptions(token, 'capital-investment/return-rate', OPTIONS),
    getOptions(token, 'capital-investment/time-horizon', OPTIONS),
    getOptions(token, 'capital-investment/restriction', OPTIONS),
    getOptions(token, 'capital-investment/construction-risk', OPTIONS),
    getOptions(token, 'capital-investment/equity-percentage', OPTIONS),
    getOptions(token, 'capital-investment/desired-deal-role', OPTIONS),
  ]
}

const getLocationOptions = (token) => {
  return [
    getOptions(token, 'uk-region'),
    getOptions(token, 'country'),
  ]
}

module.exports = {
  getInvestorDetailsOptions,
  getInvestorRequirementsOptions,
  getLocationOptions,
}
