const { assign, get } = require('lodash')

const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, chDetailsLabels, accountManagementDisplayLabels } = require('../labels')
const companyFormattingService = require('../services/formatting')

const companyDetailsDisplayOrder = [
  'business_type',
  'registered_address',
  'trading_name',
  'trading_address',
  'uk_region',
  'headquarter_type',
  'sector',
  'website',
  'description',
  'employee_range',
  'turnover_range',
]
const companiesHouseDetailsDisplayOrder = [
  'trading_name',
  'trading_address',
  'uk_region',
  'headquarter_type',
  'sector',
  'website',
  'description',
  'employee_range',
  'turnover_range',
]
const chDetailsDisplayOrder = [
  'name',
  'company_number',
  'registered_address',
  'business_type',
  'company_status',
  'incorporation_date',
  'sic_code',
]

function renderDetails (req, res) {
  const company = res.locals.company

  res.locals = assign({}, res.locals, {
    companyDetailsDisplayOrder,
    tab: 'details',
    companyType: 'foreign',
    companyDetails: companyFormattingService.getDisplayCompany(res.locals.company),
    companyDetailsLabels: companyDetailsLabels,
    accountManagementDisplayLabels: accountManagementDisplayLabels,
    accountManagementDisplay: {
      oneListAccountManager: get(res.locals, 'company.one_list_account_owner.name', 'None'),
      oneListTier: get(res.locals, 'company.classification.name', 'None'),
    },
  })

  // TODO: find a better way to check if it's a UK Ltd company
  if (get(company, 'business_type.name', '').toLowerCase() === 'limited company') {
    res.locals.companyDetailsDisplayOrder = companiesHouseDetailsDisplayOrder
  }

  if (company.companies_house_data) {
    res.locals = assign({}, res.locals, {
      regionOptions: metadataRepository.regionOptions,
      chDetails: companyFormattingService.getDisplayCH(res.locals.company.companies_house_data),
      chDetailsDisplayOrder: chDetailsDisplayOrder,
      chDetailsLabels: chDetailsLabels,
    })
  }

  res
    .breadcrumb(company.name)
    .render('companies/views/details')
}

module.exports = {
  renderDetails,
}
