const { find, get, isEmpty } = require('lodash')

const config = require('../../../../config')
const {
  transformCompanyToView,
  transformCompaniesHouseToView,
} = require('../transformers')

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

async function getBusinessTypeLabel (token, businessTypeId) {
  const businessTypeOption = await getBusinessTypeOption(token, businessTypeId)
  return get(businessTypeOption, 'label')
}

function isForeignCompany (req, res) {
  if (res.locals.company) {
    return !get(res.locals, 'company.uk_based')
  }

  return req.query.country === 'non-uk'
}

async function renderForm (req, res, next) {
  try {
    if (res.locals.companiesHouseRecord) {
      res.locals.chDetails = transformCompaniesHouseToView(res.locals.companiesHouseRecord)
    }

    const businessType = get(res.locals, 'formData.business_type')
    const businessTypeLabel = await getBusinessTypeLabel(req.session.token, businessType)
    const isForeign = isForeignCompany(req, res)
    const heading = `${res.locals.company ? 'Edit' : 'Add'} business details`

    if (res.locals.company) {
      res.breadcrumb(res.locals.company.name, `/companies/${res.locals.company.id}`)
      res.breadcrumb('Business details', `/companies/${res.locals.company.id}/business-details`)
    }

    res
      .breadcrumb(heading)
      .render('companies/views/edit', {
        isForeign,
        heading,
        businessTypeLabel,
        isOnOneList: !isEmpty(get(res.locals.company, 'one_list_group_tier')),
        companyDetails: res.locals.company ? transformCompanyToView(res.locals.company) : {},
        showCompanyNumberForUkBranch: businessType === UK_BRANCH_OF_FOREIGN_COMPANY_ID,
        oneListEmail: config.oneList.email,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderForm,
}
