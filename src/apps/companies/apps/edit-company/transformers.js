const { castArray, get, isEmpty, omitBy, pick, isUndefined } = require('lodash')

const { roundToSignificantDigits } = require('../../../../common/number')

const UNMATCHED_COMPANY_EDITABLE_FIELDS = [
  'business_type',
  'employee_range',
  'turnover_range',
  'trading_names',
  'vat_number',
  'website',
  'description',
  'uk_region',
  'sector',
  'headquarter_type',
  'address',
  'export_segment',
  'export_sub_segment',
]

const MATCHED_COMPANY_EDITABLE_FIELDS = [
  'description',
  'uk_region',
  'sector',
  'website',
  'export_segment',
  'export_sub_segment',
]

const MATCHED_COMPANY_VERIFIABLE_FIELDS = [
  'name',
  'number_of_employees',
  'turnover',
  'trading_names',
  'vat_number',
  'address1',
  'address2',
  'area',
  'city',
  'county',
  'postcode',
]

const transformCompanyToForm = (company) => {
  const whitelistedFields = company.duns_number
    ? [...MATCHED_COMPANY_EDITABLE_FIELDS, ...MATCHED_COMPANY_VERIFIABLE_FIELDS]
    : UNMATCHED_COMPANY_EDITABLE_FIELDS

  return omitBy(
    {
      ...pick(company, whitelistedFields),
      address1: get(company, 'address.line_1'),
      address2: get(company, 'address.line_2'),
      area: get(company, 'address.area.id'),
      city: get(company, 'address.town'),
      county: get(company, 'address.county'),
      postcode: get(company, 'address.postcode'),
      headquarter_type: get(company.headquarter_type, 'id', ''),
      uk_region: get(company.uk_region, 'id'),
      sector: get(company.sector, 'id'),
      employee_range: get(company.employee_range, 'id'),
      turnover_range: get(company.turnover_range, 'id'),
      trading_names: get(company.trading_names, '0'),
      turnover: roundToSignificantDigits(company.turnover_gbp, 2),
    },
    isUndefined
  )
}

const transformFormToApi = (company, formValues) => {
  const whitelistedFields = company.duns_number
    ? MATCHED_COMPANY_EDITABLE_FIELDS
    : UNMATCHED_COMPANY_EDITABLE_FIELDS

  const originalFormValues = transformCompanyToForm(company)

  return omitBy(
    {
      ...formValues,
      trading_names: formValues.trading_names
        ? castArray(formValues.trading_names)
        : [],
      headquarter_type: formValues.headquarter_type || '',
      address: {
        line_1: formValues.address1,
        line_2: formValues.address2 || '',
        town: formValues.city,
        county: formValues.county || '',
        postcode: formValues.postcode,
        area: formValues.area,
      },
    },
    (fieldValue, fieldName) =>
      isUndefined(fieldValue) ||
      !whitelistedFields.includes(fieldName) ||
      originalFormValues[fieldName] === formValues[fieldName]
  )
}

const transformFormToChangeRequest = (company, formValues) => {
  const originalFormValues = transformCompanyToForm(company)
  return omitBy(
    formValues,
    (fieldValue, fieldName) =>
      isUndefined(fieldValue) ||
      isEmpty(fieldValue) ||
      !MATCHED_COMPANY_VERIFIABLE_FIELDS.includes(fieldName) ||
      originalFormValues[fieldName] === formValues[fieldName]
  )
}

// The API expects to receive only the values that have changed.
const transformFormToDnbChangeRequest = (company, formValues) => {
  const obj = transformFormToChangeRequest(company, formValues)
  const sanitiseArea = (area) => {
    if (area === undefined) {
      return null
    }
    return {
      id: area,
    }
  }

  const address = omitBy(
    {
      line_1: obj.address1,
      line_2: obj.address2,
      town: obj.city,
      county: obj.county,
      postcode: obj.postcode,
      area: sanitiseArea(obj.area),
    },
    (fieldValue) => isEmpty(fieldValue)
  )

  delete obj.address1
  delete obj.address2
  delete obj.city
  delete obj.county
  delete obj.area
  delete obj.postcode

  const tradingNames = omitBy(
    {
      trading_names: obj.trading_names ? castArray(obj.trading_names) : [],
    },
    (fieldValue) => isEmpty(fieldValue)
  )

  delete obj.trading_names

  if (obj.turnover) {
    obj.turnover_gbp = Math.round(parseInt(formValues.turnover, 10)).toString()
    delete obj.turnover
  }

  const dnbChangeRequest = {
    ...obj,
    ...tradingNames,
  }

  if (!isEmpty(address)) {
    dnbChangeRequest.address = address
  }

  return dnbChangeRequest
}

module.exports = {
  transformCompanyToForm,
  transformFormToApi,
  transformFormToDnbChangeRequest,
}
