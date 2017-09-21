const { get } = require('lodash')

const { getDitCompany } = require('../repos')
const companyFormService = require('../services/form')
const companyService = require('../services/data')
const companyFormattingService = require('../services/formatting')
const { companyDetailsLabels, accountManagementDisplayLabels } = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const { containsFormData, isBlank } = require('../../../lib/controller-utils')
const companyWithoutCHKeys = ['business_type', 'registered_address', 'trading_name', 'trading_address', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']

async function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    const company = res.locals.company = await getDitCompany(req.session.token, req.params.id)
    companyService.getCommonTitlesAndlinks(req, res, company)
    res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
    res.locals.companyDetailsDisplayOrder = companyWithoutCHKeys
    res.locals.companyDetailsLabels = companyDetailsLabels

    res.locals.accountManagementDisplay = {
      oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
      oneListAccountManager: 'None',
    }
    res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels

    res.locals.companyType = 'foreign'
    res
      .breadcrumb(company.name)
      .render('companies/views/details')
  } catch (error) {
    next(error)
  }
}

function addDetails (req, res, next) {
  if (containsFormData(req)) {
    res.locals.formData = req.body
  } else {
    res.locals.formData = {
      business_type: metadataRepository.getIdForName(metadataRepository.businessTypeOptions, req.query.business_type).id,
    }
  }
  res.locals.businessTypeName = req.query.business_type
  res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
  res.locals.isForeign = true

  res
    .breadcrumb('Add company')
    .render('companies/views/edit')
}

async function editDetails (req, res, next) {
  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    if (containsFormData(req)) {
      res.locals.formData = req.body
    } else {
      res.locals.formData = companyFormService.getForeignCompanyAsFormData(company)
    }
    res.locals.businessTypeName = get(company, 'business_type.name')
    res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
    res.locals.isForeign = true

    res
      .breadcrumb(company.name, `/companies/view/foreign/${company.id}`)
      .breadcrumb('Edit')
      .render('companies/views/edit')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
  editDetails,
  addDetails,
}
