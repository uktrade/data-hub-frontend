const { title } = require('case')
const { omitBy } = require('lodash')

const { companyDetailsLabels, chDetailsLabels, hqLabels } = require('../labels')
const { getFormattedAddress } = require('../../../lib/address')
const { formatLongDate } = require('../../../../common/date')
const { getPrimarySectorName } = require('../../../../common/transform-sectors')

const companyDetailsDisplayOrder = Object.keys(companyDetailsLabels)
const chDetailsDisplayOrder = Object.keys(chDetailsLabels)
const companyTableKeys = ['name', 'address']

function getDisplayCH (companyHouseData) {
  if (!companyHouseData) return null

  const displayCH = {
    name: title(companyHouseData.name),
    company_number: companyHouseData.company_number,
    business_type: companyHouseData.company_category,
    company_status: companyHouseData.company_status,
    registered_address: getFormattedAddress(companyHouseData, 'registered'),
    incorporation_date: formatLongDate(companyHouseData.incorporation_date),
  }

  displayCH.sic_code = []
  if (companyHouseData.sic_code_1 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_1)
  if (companyHouseData.sic_code_2 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_2)
  if (companyHouseData.sic_code_3 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_3)
  if (companyHouseData.sic_code_4 && companyHouseData.sic_code_1.length > 0) displayCH.sic_code.push(companyHouseData.sic_code_4)

  return displayCH
}

function getDisplayCompany (company) {
  if (!company.id) return null

  const displayCompany = {
    sector: (company.sector && company.sector.name) ? getPrimarySectorName(company.sector.name) : null,
    description: company.description || null,
    website: company.website ? `<a href="${company.website}">${company.website}</a>` : null,
    employee_range: (company.employee_range && company.employee_range.name) ? company.employee_range.name : null,
    turnover_range: (company.turnover_range && company.turnover_range.name) ? company.turnover_range.name : null,
    account_manager: (company.account_manager && company.account_manager.name) ? company.account_manager.name : null,
    headquarter_type: (company.headquarter_type && company.headquarter_type.name && company.headquarter_type.name.length > 0) ? hqLabels[company.headquarter_type.name] : 'Not a headquarters',
    trading_name: (company.trading_name && company.trading_name.length > 0) ? company.trading_name : null,
    vat_number: company.vat_number,
  }

  const registeredAddress = getFormattedAddress(company, 'registered')
  displayCompany.registered_address = registeredAddress
  if (company.registered_address_country && company.registered_address_country.name) {
    displayCompany.country = company.registered_address_country.name
  }

  displayCompany.trading_address = getFormattedAddress(company, 'trading')

  if (!company.companies_house_data) {
    displayCompany.business_type = (company.business_type && company.business_type.name && company.business_type.name !== 'Undefined') ? company.business_type.name : null
    displayCompany.name = company.name
  }

  if (company.uk_region && company.uk_region.name && company.uk_region.name !== 'Undefined') displayCompany.uk_region = company.uk_region.name

  // Strip out empty or null fields
  return omitBy(displayCompany, val => !val)
}

module.exports = {
  companyDetailsDisplayOrder,
  chDetailsDisplayOrder,
  getDisplayCH,
  getDisplayCompany,
  companyTableKeys,
}
