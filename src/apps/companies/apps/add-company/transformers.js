/* eslint-disable camelcase */
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
  },
  res,
  countryAsObject = true
) => {
  const sanitiseArea = (area) => {
    if (area === undefined) {
      return {
        area: undefined,
      }
    }
    return {
      area: { id: area },
    }
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
      ...(res.locals.features['address-area-company-search'] &&
        sanitiseArea(area)),
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
}
