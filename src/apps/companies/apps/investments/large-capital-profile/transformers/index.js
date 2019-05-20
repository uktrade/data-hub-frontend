const { transformInvestorTypes, transformRequiredChecks, transformAdvisers } = require('./investor-details-to-form')
const { transformCheckboxes } = require('./investor-requirements-to-form')
const transformInvestorDetails = require('./investor-details-to-api')
const transformInvestorRequirements = require('./investor-requirements-to-api')
const transformProfile = require('./transform-profile')

module.exports = {
  transformProfile,
  transformAdvisers,
  transformCheckboxes,
  transformInvestorTypes,
  transformRequiredChecks,
  transformInvestorDetails,
  transformInvestorRequirements,
}
