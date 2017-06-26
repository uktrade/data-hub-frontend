const { countryOptions } = require('../../../lib/metadata')
const { saveCompany, getDitCompany } = require('../repository')
const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data.service')
const { containsFormData, flattenIdFields } = require('../../../lib/controller-utils')

const exportDetailsLabels = {
  exportToCountries: 'Currently exporting to',
  futureInterestCountries: 'Future countries of interest',
}

/**
 * Accepts a posted form attribute and makes sure that it is an array
 * that can be saved
 *
 * @param {any} formValue
 * @returns {array} normalised
 */
function normaliseToArray (formValue) {
  if (!formValue) {
    return []
  } else if (Array.isArray(formValue)) {
    return formValue.filter(item => item.length > 0)
  }

  return [formValue]
}

/**
 * Common method for view and edit to gather information required for company layout
 *
 */
function common (req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      res.locals.tab = 'exports'
      res.locals.company = await getInflatedDitCompany(req.session.token, req.params.id)
      res.locals.title = ['Exports', res.locals.company.name, 'Companies']

      getCommonTitlesAndlinks(req, res, res.locals.company)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 *
 *  view gathers and formats the export data for display
 */
async function view (req, res, next) {
  try {
    await common(req, res)
    const company = res.locals.company

    const data = {
      exportDetails: {
        exportToCountries: company.export_to_countries.map(country => country.name).join(', '),
        futureInterestCountries: company.future_interest_countries.map(country => country.name).join(),
      },
      exportDetailsLabels,
      exportDetailsDisplayOrder: ['exportToCountries', 'futureInterestCountries'],
    }

    res.render('companies/views/exports-view', data)
  } catch (error) {
    next(error)
  }
}

/**
 *
 * Edit gathers export data, or uses already posted data and sent it to the view for allow editing
 */
async function edit (req, res, next) {
  try {
    await common(req, res)

    const data = {
      exportDetailsLabels,
      countryOptions,
    }

    if (containsFormData(req)) {
      data.export_to_countries = req.body.export_to_countries
      data.future_interest_countries = req.body.future_interest_countries
    } else {
      data.export_to_countries = res.locals.company.export_to_countries.map(country => country.id)
      data.future_interest_countries = res.locals.company.future_interest_countries.map(country => country.id)
    }

    res.locals.title.unshift('Edit')

    res.render('companies/views/exports-edit', data)
  } catch (error) {
    next(error)
  }
}

/**
 *
 * Accept export data posted to the server and attempt to save it and handle errors
 */
async function post (req, res, next) {
  req.body.export_to_countries = normaliseToArray(req.body.export_to_countries)
  req.body.future_interest_countries = normaliseToArray(req.body.future_interest_countries)

  // Check if adding a country
  if (req.body.addExportToCountry) {
    req.body.export_to_countries.push('')
    return edit(req, res, next)
  } else if (req.body.addFutureInterestCountry) {
    req.body.future_interest_countries.push('')
    return edit(req, res, next)
  }

  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    flattenIdFields(company)
    const postData = Object.assign({}, company, {
      export_to_countries: req.body.export_to_countries,
      future_interest_countries: req.body.future_interest_countries,
    })

    await saveCompany(req.session.token, postData)
    res.redirect(`/company-exports/view/${req.params.id}`)
  } catch (errors) {
    next(errors)
  }
}

module.exports = {
  view,
  edit,
  post,
  common,
}
