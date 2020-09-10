const {
  transformObjectToGovUKOption,
} = require('../../../../../apps/transformers')
const { transformAssetClasses } = require('./transformers')
const { getOptions } = require('../../../../../lib/options')
const { getAdvisers } = require('../../../../adviser/repos')

const OPTIONS = {
  sorted: false,
  transformer: transformObjectToGovUKOption,
}

const getInvestorDetailsOptions = (req) => {
  return [
    getOptions(req, 'capital-investment/investor-type', OPTIONS),
    getOptions(req, 'capital-investment/required-checks-conducted', OPTIONS),
    getAdvisers(req),
  ]
}

const getInvestorRequirementsOptions = (req) => {
  return [
    getOptions(req, 'capital-investment/deal-ticket-size', OPTIONS),
    getOptions(req, 'capital-investment/asset-class-interest', {
      transformer: transformAssetClasses,
    }),
    getOptions(req, 'capital-investment/large-capital-investment-type', {
      sortPropertyName: 'text',
      transformer: transformObjectToGovUKOption,
    }),
    getOptions(req, 'capital-investment/return-rate', OPTIONS),
    getOptions(req, 'capital-investment/time-horizon', OPTIONS),
    getOptions(req, 'capital-investment/restriction', OPTIONS),
    getOptions(req, 'capital-investment/construction-risk', OPTIONS),
    getOptions(req, 'capital-investment/equity-percentage', OPTIONS),
    getOptions(req, 'capital-investment/desired-deal-role', OPTIONS),
  ]
}

const getLocationOptions = (req) => {
  return [getOptions(req, 'uk-region'), getOptions(req, 'country')]
}

module.exports = {
  getInvestorDetailsOptions,
  getInvestorRequirementsOptions,
  getLocationOptions,
}
