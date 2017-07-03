const companyFormService = require('../services/form')
const companyFormattingService = require('../services/formatting')
const companyRepository = require('../repos')
const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, chDetailsLabels, hqLabels } = require('../labels')
const { containsFormData, isBlank } = require('../../../lib/controller-utils')
const chDetailsDisplayOrderLong = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

function editCommon (req, res, next) {
  res.locals.chDetailsLabels = chDetailsLabels
  res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong

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

async function addDetails (req, res, next) {
  try {
    res.locals.chCompany = await companyRepository.getCHCompany(req.session.token, req.params.company_number)
    res.locals.chDetails = companyFormattingService.getDisplayCH(res.locals.chCompany)

    if (containsFormData(req)) {
      res.locals.formData = req.body
    } else {
      res.locals.formData = companyFormService.getDefaultLtdFormForCH(res.locals.chCompany)
    }
    res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
    res.locals.title = 'Add company'
    res.render(`companies/views/edit-ltd`)
  } catch (error) {
    next(error)
  }
}

async function editDetails (req, res, next) {
  try {
    if (containsFormData(req)) {
      res.locals.formData = req.body
      res.locals.title = ['Edit company', 'Companies']
    } else {
      const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
      res.locals.formData = companyFormService.getLtdCompanyAsFormData(company)
      res.locals.title = ['Edit', company.name, 'Companies']
    }
    res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
    res.render(`companies/views/edit-ltd`)
  } catch (error) {
    next(error)
  }
}

function postDetails (req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      const savedCompany = await companyFormService.saveCompanyForm(req.session.token, req.body)
      req.flash('success-message', 'Updated company record')
      res.redirect(`/companies/${savedCompany.id}/details`)
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
  editDetails,
  addDetails,
  postDetails,
  editCommon,
}
