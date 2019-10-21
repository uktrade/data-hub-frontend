/* eslint-disable camelcase */

const { castArray, get, pick, omitBy, isUndefined } = require('lodash')

const transformCompanyToForm = (company) => {
  return omitBy({
    ...pick(company, [
      'id',
      'duns_number',
      'company_number',
      'trading_names',
      'vat_number',
      'website',
      'description',
      'registered_address',
      'one_list_group_tier',
      'uk_based',
    ]),
    address1: get(company, 'address.line_1'),
    address2: get(company, 'address.line_2'),
    city: get(company, 'address.town'),
    county: get(company, 'address.county'),
    postcode: get(company, 'address.postcode'),
    country: get(company, 'address.country'),
    business_type: get(company.business_type, 'name'),
    headquarter_type: get(company.headquarter_type, 'id', 'not_headquarters'),
    uk_region: get(company.uk_region, 'id'),
    sector: get(company.sector, 'id'),
    employee_range: get(company.employee_range, 'id'),
    turnover_range: get(company.turnover_range, 'id'),
    trading_names: get(company.trading_names, '0'),
  }, isUndefined)
}

const transformFormToCompany = (values) => {
  return omitBy({
    ...pick(values, [
      'vat_number',
      'turnover_range',
      'employee_range',
      'website',
      'description',
      'uk_region',
      'sector',
      'headquarter_type',
    ]),
    trading_names: values.trading_names ? castArray(values.trading_names) : [],
    headquarter_type: values.headquarter_type !== 'not_headquarters'
      ? values.headquarter_type
      : '',
    address: {
      line_1: values.address1,
      line_2: values.address2 || '',
      town: values.city,
      county: values.county || '',
      postcode: values.postcode,
    },
  }, isUndefined)
}

module.exports = {
  transformCompanyToForm,
  transformFormToCompany,
}
