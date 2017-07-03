const { title } = require('case')
const { filter } = require('lodash')

const { getFormattedAddress } = require('../../../lib/address')
const { formatLongDate } = require('../../../../common/date')

function getDisplayCompaniesHouse (companiesHouseData) {
  if (!companiesHouseData) return null

  const displayCompaniesHouse = {
    name: title(companiesHouseData.name),
    company_number: companiesHouseData.company_number,
    business_type: companiesHouseData.company_category,
    company_status: companiesHouseData.company_status,
    registered_address: getFormattedAddress(companiesHouseData, 'registered'),
    incorporation_date: formatLongDate(companiesHouseData.incorporation_date),
  }

  displayCompaniesHouse.sic_code = filter([
    companiesHouseData.sic_code_1,
    companiesHouseData.sic_code_2,
    companiesHouseData.sic_code_3,
    companiesHouseData.sic_code_4,
  ])

  return displayCompaniesHouse
}

module.exports = {
  getDisplayCompaniesHouse,
}
