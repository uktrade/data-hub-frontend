/* eslint-disable camelcase */
const { get } = require('lodash')

const transformProfile = (profile, editing) => {
  return {
    id: profile.id,
    editing,
    investorDetails: {
      incompleteFields: get(profile, 'incomplete_details_fields.length'),
      investorType: {
        text: get(profile, 'investor_type.name'),
        value: get(profile, 'investor_type.id'),
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
