const { transformInvestorTypes, transformRequiredChecks, transformAdvisers } = require('./investor-details-to-form')
const transformInvestorDetails = require('./investor-details-to-api')
const transformProfile = require('./transform-profile')

module.exports = {
  transformProfile,
  transformAdvisers,
  transformInvestorTypes,
  transformRequiredChecks,
  transformInvestorDetails,
}
