const {
  assign,
  get,
  filter,
  isPlainObject,
  omit,
  pickBy,
} = require('lodash')

const { getOptions } = require('../../../lib/options')
const { hqLabels } = require('../labels')
const companyFormService = require('../services/form')
const { transformCompanyToForm, transformCompanyFormToApi } = require('../transformers')

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

    const companyRecord = res.locals.company
    const defaultCompanyData = isPlainObject(companyRecord) ? transformCompanyToForm(companyRecord) : null
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

function transformErrors ({ error }) {
  return {
    ...omit(error, [ 'address', 'registered_address' ]),
    ...pickBy({
      address_1: get(error.address, 'line_1'),
      address_2: get(error.address, 'line_2'),
      address_town: get(error.address, 'town'),
      address_county: get(error.address, 'country'),
      address_postcode: get(error.address, 'postcode'),
      address_country: get(error.address, 'country'),
      registered_address_1: get(error.registered_address, 'line_1'),
      registered_address_2: get(error.registered_address, 'line_2'),
      registered_address_town: get(error.registered_address, 'town'),
      registered_address_county: get(error.registered_address, 'country'),
      registered_address_postcode: get(error.registered_address, 'postcode'),
      registered_address_country: get(error.registered_address, 'country'),
    }),
  }
}

async function handleFormPost (req, res, next) {
  try {
    const { token } = req.session
    const isUkCompany = req.query.country === 'uk'
    const body = transformCompanyFormToApi(req.body, isUkCompany)

    const savedCompany = await companyFormService.saveCompanyForm(token, body)
    const detailsUrl = getDetailsUrl(res.locals.features, res.locals.company, savedCompany)

    req.flash('success', 'Company record updated')
    res.redirect(detailsUrl)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.errors = transformErrors(err)
      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
}
