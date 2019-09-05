/* eslint-disable camelcase */
const { sanitizeCheckboxes } = require('../../utils/transformers')

const transformLocation = ({ notes_on_locations, uk_region_locations }) => {
  return {
    notes_on_locations,
    uk_region_locations: sanitizeCheckboxes(uk_region_locations),
  }
}

module.exports = transformLocation
