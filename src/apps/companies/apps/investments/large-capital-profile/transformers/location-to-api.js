/* eslint-disable camelcase */
const { sanitiseUserSelection } = require('../../utils/transformers')

const transformLocation = ({
  notes_on_locations,
  uk_region_locations,
  other_countries_being_considered,
}) => {
  return {
    notes_on_locations,
    uk_region_locations: uk_region_locations
      ? sanitiseUserSelection(uk_region_locations)
      : [],
    other_countries_being_considered: other_countries_being_considered
      ? sanitiseUserSelection(other_countries_being_considered)
      : [],
  }
}

module.exports = transformLocation
