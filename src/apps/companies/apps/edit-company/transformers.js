/* eslint-disable camelcase */

const { castArray, get, isEmpty, omitBy, pick, isUndefined } = require('lodash')

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
]

const MATCHED_COMPANY_EDITABLE_FIELDS = ['description', 'uk_region', 'sector']

const MATCHED_COMPANY_VERIFIABLE_FIELDS = [
  'name',
  'number_of_employees',
  'turnover',
  'trading_names',
  'vat_number',
  'website',
  'address1',
  'address2',
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
      city: get(company, 'address.town'),
      county: get(company, 'address.county'),
      postcode: get(company, 'address.postcode'),
      headquarter_type: get(company.headquarter_type, 'id', ''),
      uk_region: get(company.uk_region, 'id'),
      sector: get(company.sector, 'id'),
      employee_range: get(company.employee_range, 'id'),
      turnover_range: get(company.turnover_range, 'id'),
      trading_names: get(company.trading_names, '0'),
    },
    isUndefined
  )
}

const transformFormToApi = (company, formValues) => {
  const whitelistedFields = company.duns_number
    ? MATCHED_COMPANY_EDITABLE_FIELDS
    : UNMATCHED_COMPANY_EDITABLE_FIELDS

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
      },
    },
    (fieldValue, fieldName) =>
      isUndefined(fieldValue) || !whitelistedFields.includes(fieldName)
  )
}

const transformFormToZendesk = (company, formValues) => {
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

module.exports = {
  transformCompanyToForm,
  transformFormToApi,
  transformFormToZendesk,
}
