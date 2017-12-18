const { assign, find, get } = require('lodash')

const { getOptions } = require('../../../lib/options')
const { hqLabels } = require('../labels')
const companyFormService = require('../services/form')
const { transformCompanyToForm } = require('../transformers')

function getHeadquarterOptions (token) {
  return getOptions(token, 'headquarter-type')
    .then((options) => {
      const headquarterOptions = options.map(option => {
        return {
          value: option.value,
          label: hqLabels[option.label],
        }
      })

      headquarterOptions.unshift({
        value: 'not_headquarters',
        label: 'Not a headquarters',
      })

      return headquarterOptions
    })
}

async function getCompanyFormOptions (token, createdOn) {
  return {
    headquarters: await getHeadquarterOptions(token),
    regions: await getOptions(token, 'uk-region', { createdOn }),
    sectors: await getOptions(token, 'sector', { createdOn }),
    employees: await getOptions(token, 'employee-range', { createdOn }),
    turnovers: await getOptions(token, 'turnover', { createdOn }),
    countries: await getOptions(token, 'country', { createdOn }),
  }
}

async function populateForm (req, res, next) {
  try {
    const token = req.session.token
    const createdOn = get(res.locals, 'company.created_on')

    const defaultCompanyData = transformCompanyToForm(res.locals.companiesHouseRecord || res.locals.company)
    const formData = assign({}, defaultCompanyData, req.body)

    if (get(req.query, 'business_type')) {
      formData.business_type = req.query.business_type
    }

    if (!get(formData.headquarter_type)) {
      formData.headquarter_type = 'not_headquarters'
    }

    res.locals = assign({}, res.locals, {
      formData,
      options: await getCompanyFormOptions(token, createdOn),
    })

    next()
  } catch (error) {
    next(error)
  }
}

async function handleFormPost (req, res, next) {
  try {
    const token = req.session.token
    const countryQueryParam = get(req.query, 'country')

    if (get(req.body, 'headquarter_type') === 'not_headquarters') {
      req.body.headquarter_type = ''
    }

    if (countryQueryParam && countryQueryParam === 'uk') {
      const countryOptions = await getOptions(token, 'country')
      const ukCountryOption = find(countryOptions, (option) => {
        return option.label === 'United Kingdom'
      })

      if (get(req.body, 'registered_address_1')) {
        req.body.registered_address_country = ukCountryOption.value
      }

      if (get(req.body, 'trading_address_1')) {
        req.body.trading_address_country = ukCountryOption.value
      }
    }

    const savedCompany = await companyFormService.saveCompanyForm(token, req.body)

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

function setIsEditMode (req, res, next) {
  res.locals.isEditMode = true
  next()
}

module.exports = {
  populateForm,
  handleFormPost,
  setIsEditMode,
}
