const { transformInvestorTypes, transformRequiredChecks } = require('./investor-details-to-form')
const transformInvestorDetails = require('./investor-details-to-api')
const transformProfile = require('./transform-profile')

module.exports = {
  transformProfile,
  transformInvestorTypes,
  transformRequiredChecks,
  transformInvestorDetails,
}
