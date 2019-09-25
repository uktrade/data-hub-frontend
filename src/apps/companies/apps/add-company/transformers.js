/* eslint-disable camelcase */
const transformToDnbCompanyInvestigationApi = ({
  business_type,
  name,
  website,
  telephone_number,
  address1,
  address2,
  city,
  county,
  postcode,
  country,
  uk_region,
  sector,
}) => {
  return {
    business_type,
    name,
    website,
    telephone_number,
    address: {
      line_1: address1,
      line_2: address2 || '',
      town: city,
      county: county || '',
      postcode: postcode,
      country: {
        id: country,
      },
    },
    sector,
    uk_region,
  }
}

module.exports = {
  transformToDnbCompanyInvestigationApi,
}
