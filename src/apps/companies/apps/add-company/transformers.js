const { CANADA_ID, UNITED_STATES_ID } = require('../../../../common/constants')

const transformFormData = (
  {
    name,
    website,
    telephone_number,
    address1,
    address2,
    city,
    county,
    postcode,
    country,
    area,
    areaUS,
    areaCanada,
  },
  res,
  countryAsObject = true
) => {
  const sanitiseArea = () => {
    if (country === UNITED_STATES_ID && areaUS) return { area: { id: areaUS } }
    if (country === CANADA_ID && areaCanada) return { area: { id: areaCanada } }
    if (area === undefined) return { area: undefined }
    return { area: { id: area } }
  }

  return {
    name,
    website,
    telephone_number,
    address: {
      line_1: address1,
      line_2: address2 || '',
      town: city,
      county: county || '',
      postcode: postcode,
      country: countryAsObject ? { id: country } : country,
      ...sanitiseArea(),
    },
  }
}

const transformToDnbStubCompany = (formData, res) => {
  return {
    ...transformFormData(formData, res),
    business_type: formData.business_type,
    uk_region: formData.uk_region,
    sector: formData.sector,
  }
}

const transformToCreateDnbCompanyInvestigation = (formData, companyId, res) => {
  return {
    ...transformFormData(formData, res, false),
    company: companyId,
  }
}

module.exports = {
  transformToDnbStubCompany,
  transformToCreateDnbCompanyInvestigation,
  transformFormData,
}
