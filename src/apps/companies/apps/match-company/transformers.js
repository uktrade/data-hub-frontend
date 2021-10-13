const { isEmpty, omit } = require('lodash')

const transformToDnbInvestigation = (
  { id, name, address },
  website,
  telephone_number
) => {
  const dnbInvestigation = {
    company: id,
    name,
    website,
    telephone_number,
    address: {
      ...omit(address, ['country', 'area']),
      country: address.country.id,
    },
  }
  if (!isEmpty(address.area)) {
    dnbInvestigation.address.area = address.area
  }
  return dnbInvestigation
}

module.exports = {
  transformToDnbInvestigation,
}
