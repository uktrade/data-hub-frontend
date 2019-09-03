/* eslint-disable camelcase */
const { assign, filter, flatten } = require('lodash')

const metadataRepo = require('../../../lib/metadata')
const { saveCompany } = require('../repos')
const { transformObjectToOption } = require('../../transformers')
const { transformCompanyToExportDetailsView } = require('../transformers')
const { exportDetailsLabels } = require('../labels')

function renderExports (req, res) {
  const { company } = res.locals
  const exportDetails = transformCompanyToExportDetailsView(company)

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Exports')
    .render('companies/views/exports-view', {
      exportDetails,
    })
}

function populateExportForm (req, res, next) {
  const {
    export_to_countries,
    combined_future_interest_countries,
    export_experience_category,
  } = res.locals.company

  res.locals.formData = assign({}, {
    export_experience_category,
    export_to_countries: export_to_countries.map(country => country.id),
    combined_future_interest_countries: combined_future_interest_countries.map(country => country.id),
  }, req.body)

  next()
}

function renderExportEdit (req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Exports', `/companies/${company.id}/exports`)
    .breadcrumb('Edit')
    .render('companies/views/exports-edit', {
      exportDetailsLabels,
      exportExperienceCategories: metadataRepo.exportExperienceCategory.map(transformObjectToOption),
      countryOptions: metadataRepo.countryOptions.map(transformObjectToOption),
    })
}

async function handleEditFormPost (req, res, next) {
  const exportToCountries = flatten([req.body.export_to_countries])
  const combinedFutureInterestCountries = flatten([req.body.combined_future_interest_countries])

  const data = assign({}, res.locals.company, {
    export_experience_category: req.body.export_experience_category,
    export_to_countries: filter(exportToCountries),
    combined_future_interest_countries: filter(combinedFutureInterestCountries),
  })
  // We are setting combined_future_interest_countries now,
  // but the API still also returns future_interest_countries.
  // If we supply future_interest_countries with the stale value,
  // it will override what we supply for combined_future_interest_countries.
  delete data.future_interest_countries

  try {
    const save = await saveCompany(req.session.token, data)

    res.redirect(`/companies/${save.id}/exports`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  populateExportForm,
  renderExports,
  renderExportEdit,
  handleEditFormPost,
}
