const companyDetailsLabels = {
  business_type: 'Business type',
  name: 'Name',
  registered_address: 'Primary address',
  trading_name: 'Trading name',
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
  country: 'Country',
  business_type_for_other: 'Type of organisation',
  business_type_uk_other: 'Type of organisation',
  headquarter_type: 'Headquarters',
  archived: 'Archived status',
  archived_on: 'Archive date',
  archived_reason: 'Archived reason',
  archived_by_id: 'Archived by',
  company_number: 'Companies House number',
  account_manager: 'Account manager',
  vat_number: 'VAT number',
  reference_code: 'CDMS reference',
}
const chDetailsLabels = {
  name: 'Registered name',
  company_number: 'Companies House No',
  registered_address: 'Registered office address',
  business_type: 'Company type',
  company_status: 'Company status',
  incorporation_date: 'Incorporated on',
  sic_code: 'Nature of business (SIC)',
}

const address = {
  companyRegisteredAddress: 'Primary address',
  companyTradingAddress: 'Trading address',
  companiesHouseRegisteredAddress: 'Registered address',
}

const companyTypeOptions = {
  ltd: 'UK private or public limited company',
  ukother: 'Other type of UK organisation',
  foreign: 'Foreign organisation',
}

const hqLabels = {
  'ehq': 'European headquarters (EHQ)',
  'ghq': 'Global headquarters (GHQ)',
  'ukhq': 'UK headquarters (UK HQ)',
}
const accountManagementDisplayLabels = {
  oneListTier: 'One List tier',
  oneListAccountManager: 'One List account manager',
}

const exportDetailsLabels = {
  exportExperienceCategory: 'Export win category',
  exportToCountries: 'Currently exporting to',
  futureInterestCountries: 'Future countries of interest',
}

module.exports = {
  companyDetailsLabels,
  chDetailsLabels,
  companyTypeOptions,
  hqLabels,
  accountManagementDisplayLabels,
  exportDetailsLabels,
  address,
}
