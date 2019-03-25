/* eslint-disable camelcase */
const transformProfile = ({
  incomplete_details_fields,
  incomplete_requirements_fields,
  incomplete_location_fields }) => {
  return {
    investorDetails: {
      incompleteFields: incomplete_details_fields.length,
    },
    investorRequirements: {
      incompleteFields: incomplete_requirements_fields.length,
    },
    location: {
      incompleteFields: incomplete_location_fields.length,
    },
  }
}

module.exports = transformProfile
