const {
  transformInvestorTypes,
  transformRequiredChecks,
  transformAdvisers,
} = require('./investor-details-to-form')
const {
  transformCheckboxes,
  transformRadioButtons,
} = require('./investor-requirements-to-form')
const transformInvestorRequirements = require('./investor-requirements-to-api')
const transformAssetClasses = require('./transform-asset-classes')
const transformProfile = require('./transform-profile')
const transformLocation = require('./location-to-api')

module.exports = {
  transformProfile,
  transformAdvisers,
  transformCheckboxes,
  transformRadioButtons,
  transformAssetClasses,
  transformInvestorTypes,
  transformRequiredChecks,
  transformInvestorRequirements,
  transformLocation,
}
