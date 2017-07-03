const companyRepository = require('../repos')
const companyFormService = require('../services/form')
const { companyDetailsLabels, hqLabels } = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const { containsFormData, isBlank } = require('../../../lib/controller-utils')

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

  res.render('companies/views/edit-foreign')
}

async function editDetails (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    if (containsFormData(req)) {
      res.locals.formData = req.body
    } else {
      res.locals.formData = companyFormService.getForeignCompanyAsFormData(company)
    }
    res.locals.businessTypeName = company.business_type.name
    res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
    res.locals.title = ['Edit', company.name, 'Companies']
    res.render(`companies/views/edit-foreign`)
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
