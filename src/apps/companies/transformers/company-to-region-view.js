/* eslint-disable camelcase */
const { get } = require('lodash')

const { NOT_SET_TEXT } = require('../constants')
const unitedKingdomId = '80756b9a-5d95-e211-a939-e4115bead28a'

module.exports = ({
  address,
  uk_region,
}) => {
  if (address.country.id === unitedKingdomId) {
    return get(uk_region, 'name', NOT_SET_TEXT)
  }
}
