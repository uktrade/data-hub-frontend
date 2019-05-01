/* eslint-disable camelcase */
const { get } = require('lodash')

const transformProfile = (profile, editing) => {
  return {
    id: profile.id,
    editing,
    investorDetails: {
      incompleteFields: get(profile, 'incomplete_details_fields.length'),
      investorType: {
        text: get(profile, 'investor_type.name', null),
        value: get(profile, 'investor_type.id', null),
      },
      globalAssetsUnderManagement: {
        value: get(profile, 'global_assets_under_management'),
      },
      investableCapital: {
        value: get(profile, 'investable_capital'),
      },
      investorDescription: {
        value: get(profile, 'investor_description'),
      },
      requiredChecks: {
        conductedOn: get(profile, 'required_checks_conducted_on'),
        conducted: get(profile, 'required_checks_conducted'),
      },
    },
    investorRequirements: {
      incompleteFields: get(profile, 'incomplete_requirements_fields.length'),
    },
    location: {
      incompleteFields: get(profile, 'incomplete_location_fields.length'),
    },
  }
}

module.exports = transformProfile
