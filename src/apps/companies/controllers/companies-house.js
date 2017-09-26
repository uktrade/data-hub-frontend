const { getFormattedAddress } = require('../../../lib/address')
const { getDisplayCH } = require('../services/formatting')
const { chDetailsLabels } = require('../labels')

const chDetailsDisplayOrder = [
  'name',
  'company_number',
  'registered_address',
  'business_type',
  'company_status',
  'incorporation_date',
  'sic_code',
]

function renderCompaniesHouseCompany (req, res, next) {
  const company = res.locals.companiesHouseRecord
  const { name, company_number } = company

  res
    .breadcrumb(name)
    .render('companies/views/details', {
      chDetailsLabels,
      chDetailsDisplayOrder,
      tab: 'details',
      chDetails: getDisplayCH(company),
      company: {
        name,
        company_number,
        companies_house_data: company,
        address: getFormattedAddress(company, 'registered'),
      },
    })
}

module.exports = {
  renderCompaniesHouseCompany,
}
