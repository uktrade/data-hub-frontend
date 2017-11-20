const { assign, find, get } = require('lodash')

const { transformCompaniesHouseToView } = require('../transformers')

const { buildUkOtherCompanyOptions, buildForeignOtherCompanyOptions } = require('../options')

function getBusinessTypeOption (businessTypeUUID) {
  const ukOtherCompanyOptions = buildUkOtherCompanyOptions()
  const foreignOtherCompanyOptions = buildForeignOtherCompanyOptions()
  return (
    find(ukOtherCompanyOptions, { value: businessTypeUUID }) ||
    find(foreignOtherCompanyOptions, { value: businessTypeUUID })
  )
}

function getBusinessTypeLabel (companiesHouseCategory, isForeign, businessTypeUUID) {
  let prefix = isForeign ? 'Foreign' : 'UK'
  if (companiesHouseCategory) {
    return `${prefix} ${companiesHouseCategory}`
  }
  const businessTypeOption = getBusinessTypeOption(businessTypeUUID)
  if (businessTypeOption) {
    return `${prefix} ${businessTypeOption.label}`
  }
}

function renderForm (req, res) {
  const pageTitle = res.locals.company ? 'Edit' : 'Add company'
  let isForeign = false

  if (res.locals.company) {
    res.breadcrumb(get(res.locals, 'company.name'), `/companies/${get(res.locals, 'company.id')}`)
    isForeign = !(get(res.locals, 'company.uk_based'))
  }

  if (req.query.country === 'non-uk') {
    isForeign = true
  }

  if (res.locals.companiesHouseRecord) {
    res.locals = assign({}, res.locals, {
      isCompaniesHouse: true,
      chDetails: transformCompaniesHouseToView(res.locals.companiesHouseRecord),
    })
  }
  const businessTypeLabel = getBusinessTypeLabel(
    res.locals.companiesHouseCategory, isForeign, res.locals.businessType
  )

  res
    .breadcrumb(pageTitle)
    .render('companies/views/edit', {
      isForeign,
      businessTypeLabel,
    })
}

module.exports = {
  renderForm,
  getBusinessTypeLabel,
}
