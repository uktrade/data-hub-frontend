const { assign, find, get } = require('lodash')

const metadataRepository = require('../../../lib/metadata')
const { hqLabels, chDetailsLabels } = require('../labels')
const companyFormService = require('../services/form')
const { transformCompanyResponseToForm } = require('../transformers')
const { transformObjectToOption } = require('../../transformers')

const chDetailsDisplayOrder = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

function populateForm (req, res, next) {
  const countryQueryParam = get(req.query, 'country')
  const headquarterOptions = metadataRepository.headquarterOptions
    .map(transformObjectToOption)
    .map(option => {
      return {
        value: option.value,
        label: hqLabels[option.label],
      }
    })

  headquarterOptions.unshift({
    value: 'not_headquarters',
    label: 'Not a headquarters',
  })

  res.locals.form = assign({}, res.locals.form, {
    state: transformCompanyResponseToForm(res.locals.companiesHouseRecord || res.locals.company) || {},
  })

  if (get(req.query, 'business_type')) {
    const businessType = find(metadataRepository.businessTypeOptions, (type) => {
      return type.name.toLowerCase() === req.query.business_type.toLowerCase()
    })

    res.locals.form.state.business_type = get(businessType, 'id')
  }

  if (countryQueryParam && countryQueryParam === 'uk') {
    const ukCountryOption = find(metadataRepository.countryOptions.map(transformObjectToOption), (option) => {
      return option.label === 'United Kingdom'
    })

    res.locals.form.state.registered_address_country = ukCountryOption.value
    res.locals.form.state.trading_address_country = ukCountryOption.value
  }

  res.locals.formData = assign({}, res.locals.form.state, req.body)

  if (!get(res.locals, 'formData.headquarter_type')) {
    res.locals.formData.headquarter_type = 'not_headquarters'
  }

  res.locals = assign({}, res.locals, {
    chDetailsLabels,
    chDetailsDisplayOrder,
    headquarterOptions,
    regionOptions: metadataRepository.regionOptions.map(transformObjectToOption),
    sectorOptions: metadataRepository.sectorOptions.map(transformObjectToOption),
    employeeOptions: metadataRepository.employeeOptions.map(transformObjectToOption),
    turnoverOptions: metadataRepository.turnoverOptions.map(transformObjectToOption),
    countryOptions: metadataRepository.countryOptions.map(transformObjectToOption),
    businessType: req.query.business_type || get(res.locals, 'company.business_type.name'),
    showTradingAddress: get(res.locals, 'form.state.trading_address_1'),
  })

  next()
}

async function handleFormPost (req, res, next) {
  if (get(req.body, 'headquarter_type') === 'not_headquarters') {
    req.body.headquarter_type = ''
  }

  try {
    const savedCompany = await companyFormService.saveCompanyForm(req.session.token, req.body)

    req.flash('success', 'Company record updated')
    res.redirect(`/companies/${savedCompany.id}`)
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
