const { assign, find, get } = require('lodash')

const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, hqLabels, chDetailsLabels } = require('../labels')
const companyFormService = require('../services/form')
const { transformCompanyResponseToForm } = require('../transformers')

const chDetailsDisplayOrder = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

function populateForm (req, res, next) {
  res.locals.form = assign({}, res.locals.form, {
    state: transformCompanyResponseToForm(res.locals.companiesHouseRecord || res.locals.company) || {},
  })

  if (get(req.query, 'business_type')) {
    const businessType = find(metadataRepository.businessTypeOptions, (type) => {
      return type.name.toLowerCase() === req.query.business_type.toLowerCase()
    })

    res.locals.form.state.business_type = get(businessType, 'id')
  }

  res.locals.formData = assign({}, res.locals.form.state, req.body)

  res.locals = assign({}, res.locals, {
    hqLabels,
    companyDetailsLabels,
    chDetailsLabels,
    chDetailsDisplayOrder,
    regionOptions: metadataRepository.regionOptions,
    sectorOptions: metadataRepository.sectorOptions,
    employeeOptions: metadataRepository.employeeOptions,
    turnoverOptions: metadataRepository.turnoverOptions,
    headquarterOptions: metadataRepository.headquarterOptions,
    countryOptions: metadataRepository.countryOptions,
    businessType: req.query.business_type || get(res.locals, 'company.business_type.name'),
    showTradingAddress: get(res.locals, 'form.state.trading_address_country'),
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
