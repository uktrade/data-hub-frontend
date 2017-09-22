const { assign } = require('lodash')

const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, hqLabels } = require('../labels')
const companyFormService = require('../services/form')

function populateForm (req, res, next) {
  res.locals = assign({}, res.locals, {
    hqLabels,
    companyDetailsLabels,
    regionOptions: metadataRepository.regionOptions,
    sectorOptions: metadataRepository.sectorOptions,
    employeeOptions: metadataRepository.employeeOptions,
    turnoverOptions: metadataRepository.turnoverOptions,
    headquarterOptions: metadataRepository.headquarterOptions,
    countryOptions: metadataRepository.countryOptions,
  })

  next()
}

async function handleFormPost (req, res, next) {
  try {
    const savedCompany = await companyFormService.saveCompanyForm(req.session.token, req.body)

    req.flash('success', 'Company record updated')
    res.redirect(`/viewcompanyresult/${savedCompany.id}`)
  } catch (response) {
    if (response.errors) {
      // Leeloo has inconsistant structure to return errors.
      // Get the errors and then re-render the edit page.
      if (response.errors.errors) {
        res.locals.errors = response.errors.errors
      } else {
        res.locals.errors = response.errors
      }
      next()
    } else {
      next(response)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
}
