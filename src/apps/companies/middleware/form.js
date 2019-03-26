const { assign, find, get, filter } = require('lodash')

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
  const countries = await getOptions(token, 'country', { createdOn })
  const foreignCountries = filter(countries, (country) => { return country.label !== 'United Kingdom' })
  return {
    foreignCountries,
    headquarters: await getHeadquarterOptions(token),
    regions: await getOptions(token, 'uk-region', { createdOn }),
    sectors: await getOptions(token, 'sector', { createdOn }),
    employees: await getOptions(token, 'employee-range', { createdOn, sorted: false }),
    turnovers: await getOptions(token, 'turnover', { createdOn, sorted: false }),
  }
}

async function populateForm (req, res, next) {
  try {
    const token = req.session.token
    const createdOn = get(res.locals, 'company.created_on')
    const options = await getCompanyFormOptions(token, createdOn)

    const defaultCompanyData = transformCompanyToForm(res.locals.companiesHouseRecord || res.locals.company)
    const formData = assign({}, defaultCompanyData, req.body)

    if (get(req.query, 'business_type')) {
      formData.business_type = req.query.business_type
    }

    res.locals = assign({}, res.locals, {
      formData,
      options,
    })

    next()
  } catch (error) {
    next(error)
  }
}

function getDetailsUrl (features, currentCompany, savedCompany) {
  return currentCompany ? `/companies/${savedCompany.id}/business-details` : `/companies/${savedCompany.id}`
}

async function handleFormPost (req, res, next) {
  try {
    const token = req.session.token
    const countryQueryParam = get(req.query, 'country')

    req.body.trading_names = req.body.trading_names ? [ req.body.trading_names ] : []

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
    const detailsUrl = getDetailsUrl(res.locals.features, res.locals.company, savedCompany)

    req.flash('success', 'Company record updated')
    res.redirect(detailsUrl)
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
