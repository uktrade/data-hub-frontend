const companyDetailLabels = {
  business_type: 'Business type',
  name: 'Name',
  registered_address: 'Primary address',
  alias: 'Trading name',
  trading_address: 'Trading address',
  uk_region: 'UK region',
  headquarters: 'Headquarters',
  sector: 'Sector',
  website: 'Website',
  description: 'Business description',
  employee_range: 'Number of employees',
  turnover_range: 'Annual turnover',
  trading_address_1: 'Trading address street',
  trading_address_2: 'Trading address street',
  trading_address_town: 'Trading address town',
  trading_address_county: 'Trading address county',
  trading_address_postcode: 'Trading address postcode',
  trading_address_country: 'Trading address country',
  registered_address_1: 'Registered address street',
  registered_address_2: 'Registered address street',
  registered_address_town: 'Registered address town',
  registered_address_county: 'Registered address county',
  registered_address_postcode: 'Registered address postcode',
  registered_address_country: 'Registered address country',
  business_type_for_other: 'Type of organisation',
  business_type_uk_other: 'Type of organisation'
}
const chDetailLabels = {
  name: 'Registered company name',
  company_number: 'Companies House number',
  registered_address: 'Registered office address',
  business_type: 'Company type',
  company_status: 'Company status',
  sic_code: 'Nature of business (SIC)',
  incorporation_date: 'Incorporation date'
}
const companyTableHeadings = {
  name: 'Company name',
  address: 'Address'
}
const companyTypeOptions = {
  ltd: 'UK private or public limited company',
  ltdchild: 'Child of a UK private or public limited company',
  ukother: 'Other type of UK organisation',
  forother: 'Foreign organisation'
}

module.exports = { companyDetailLabels, chDetailLabels, companyTableHeadings, companyTypeOptions }

