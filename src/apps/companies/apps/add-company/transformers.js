/* eslint-disable camelcase */
const transformToDnbCompanyInvestigationApi = ({
  business_type,
  name,
  website,
  telephone_number,
  uk_region,
  sector,
}) => {
  return {
    business_type,
    name,
    website,
    telephone_number,
    address: {
      line_1: 'Unit 10, Ockham Drive',
      line_2: null,
      town: 'GREENFORD',
      county: null,
      country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
      },
      postcode: 'UB6 0F2',
    },
    sector,
    uk_region,
  }
}

module.exports = {
  transformToDnbCompanyInvestigationApi,
}
