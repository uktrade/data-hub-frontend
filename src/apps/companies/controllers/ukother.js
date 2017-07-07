const companyRepository = require('../repos')
const companyFormService = require('../services/form')
const companyService = require('../services/data')
const companyFormattingService = require('../services/formatting')
const { companyDetailsLabels, accountManagementDisplayLabels, hqLabels } = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const { containsFormData, isBlank } = require('../../../lib/controller-utils')
const companyWithoutCHKeys = ['business_type', 'registered_address', 'alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']

async function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    const company = res.locals.company = await companyService.getInflatedDitCompany(req.session.token, req.params.id)
    companyService.getCommonTitlesAndlinks(req, res, company)
    res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
    res.locals.companyDetailsDisplayOrder = companyWithoutCHKeys
    res.locals.companyDetailsLabels = companyDetailsLabels

    res.locals.accountManagementDisplay = {
      oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
      oneListAccountManager: 'None',
    }
    res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels
    res.locals.title = [company.name, 'Companies']

    res.render('companies/views/details-ukother')
  } catch (error) {
    next(error)
  }
}

function editCommon (req, res, next) {
  res.locals.regionOptions = metadataRepository.regionOptions
  res.locals.sectorOptions = metadataRepository.sectorOptions
  res.locals.employeeOptions = metadataRepository.employeeOptions
  res.locals.turnoverOptions = metadataRepository.turnoverOptions
  res.locals.headquarterOptions = metadataRepository.headquarterOptions
  res.locals.companyDetailsLabels = companyDetailsLabels
  res.locals.countryOptions = metadataRepository.countryOptions
  res.locals.hqLabels = hqLabels

  if (next) next()
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
  res.locals.title = 'Add company'
  res.render(`companies/views/edit-ukother`)
}

async function editDetails (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    if (containsFormData(req)) {
      res.locals.formData = req.body
    } else {
      res.locals.formData = companyFormService.getUkOtherCompanyAsFormData(company)
    }
    res.locals.businessTypeName = company.business_type.name
    res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
    res.locals.title = ['Edit', company.name, 'Companies']
    res.render(`companies/views/edit-ukother`)
  } catch (error) {
    next(error)
  }
}

function postDetails (req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      const savedCompany = await companyFormService.saveCompanyForm(req.session.token, req.body)
      req.flash('success', 'Updated company record')
      res.redirect(`/companies/view/ukother/${savedCompany.id}`)
    } catch (response) {
      if (response.errors) {
        // Leeloo has inconsistant structure to return errors.
        // Get the errors and then re-render the edit page.
        if (response.errors.errors) {
          res.locals.errors = response.errors.errors
        } else {
          res.locals.errors = response.errors
        }

        // re-edit the data
        editCommon(req, res)
        if (req.params.id) {
          editDetails(req, res, next)
        } else {
          addDetails(req, res, next)
        }
      } else {
        next(response)
      }
    }
  })
}

module.exports = {
  getDetails,
  editDetails,
  addDetails,
  postDetails,
  editCommon,
}
