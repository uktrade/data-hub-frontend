/* eslint-disable camelcase */
const { get } = require('lodash')

const { NOT_SET_TEXT } = require('../constants')

const unitedKingdomId = '80756b9a-5d95-e211-a939-e4115bead28a'

const getCompanyRegionUrl = (archived = true, duns_number, companyId) => {
  if (archived) {
    return null
  }

  let url = `/companies/${companyId}`
  return duns_number ? url + '/business-details/region' : url + '/edit'
}

module.exports = ({
  address,
  uk_region,
  archived,
  duns_number,
  id,
}) => {
  if (address.country.id === unitedKingdomId) {
    const name = get(uk_region, 'name', NOT_SET_TEXT)
    const url = getCompanyRegionUrl(archived, duns_number, id)
    return {
      name,
      url,
    }
  }
}
