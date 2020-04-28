const { omit } = require('lodash')

const transformToDnbInvestigation = (
  { id, name, address },
  website,
  telephone_number
) => {
  return {
    company: id,
    name,
    website,
    telephone_number,
    address: {
      ...omit(address, 'country'),
      country: address.country.id,
    },
  }
}

module.exports = {
  transformToDnbInvestigation,
}
