const { assign, find, get, isEmpty } = require('lodash')

const { transformCompaniesHouseToView } = require('../transformers')
const { buildUkOtherCompanyOptions, buildForeignOtherCompanyOptions } = require('../options')
const UK_BRANCH_OF_FOREIGN_COMPANY_ID = 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98'

async function getBusinessTypeOption (token, businessTypeId) {
  const ukOtherCompanyOptions = await buildUkOtherCompanyOptions(token)
  const foreignOtherCompanyOptions = await buildForeignOtherCompanyOptions(token)
  return (
    find(ukOtherCompanyOptions, { value: businessTypeId }) ||
    find(foreignOtherCompanyOptions, { value: businessTypeId })
  )
}

async function getBusinessTypeLabel (token, companiesHouseCategory, businessTypeId) {
  if (companiesHouseCategory) {
    return companiesHouseCategory
  }
  const businessTypeOption = await getBusinessTypeOption(token, businessTypeId)
  if (businessTypeOption) {
    return businessTypeOption.label
  }
}

function isForeignCompany (req, res) {
  if (res.locals.company) {
    return !get(res.locals, 'company.uk_based')
  }

  return req.query.country === 'non-uk'
}

function getHeading (company, isForeign) {
  const action = company ? 'Edit' : 'Add'
  const type = isForeign ? 'foreign' : 'UK'

  return `${action} ${type} company`
}

async function renderForm (req, res) {
  if (res.locals.companiesHouseRecord) {
    res.locals = assign({}, res.locals, {
      isCompaniesHouse: true,
      chDetails: transformCompaniesHouseToView(res.locals.companiesHouseRecord),
    })
  }

  const businessType = get(res.locals, 'formData.business_type')
  const businessTypeLabel = await getBusinessTypeLabel(
    req.session.token, res.locals.companiesHouseCategory, businessType
  )
  const showTradingAddress = !isEmpty(get(res.locals, 'formData.trading_address_1'))

  if (res.locals.company) {
    res.breadcrumb(get(res.locals, 'company.name'), `/companies/${get(res.locals, 'company.id')}`)
  }

  const isForeign = isForeignCompany(req, res)

  res
    .breadcrumb(res.locals.company ? 'Edit' : 'Add')
    .render('companies/views/edit', {
      isForeign,
      businessTypeLabel,
      showTradingAddress,
      showCompanyNumber: businessType === UK_BRANCH_OF_FOREIGN_COMPANY_ID,
      heading: getHeading(res.locals.company, isForeign),
    })
}

module.exports = {
  renderForm,
}
