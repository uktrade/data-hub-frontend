const { assign, filter, flatten } = require('lodash')

const metadataRepo = require('../../../lib/metadata')
const { saveCompany } = require('../repos')
const { transformObjectToOption } = require('../../transformers')
const { transformCompanyResponseToExportDetailsViewRecord } = require('../transformers')
const { exportDetailsLabels } = require('../labels')

function renderExports (req, res) {
  const exportDetails = transformCompanyResponseToExportDetailsViewRecord(res.locals.company)

  res
    .breadcrumb('Exports')
    .render('companies/views/exports-view', {
      exportDetails,
    })
}

function populateExportForm (req, res, next) {
  const { export_to_countries, future_interest_countries } = res.locals.company

  const savedValues = {
    export_to_countries: export_to_countries.map(country => country.id),
    future_interest_countries: future_interest_countries.map(country => country.id),
  }

  res.locals.formData = assign({}, savedValues, req.body)

  next()
}

function renderExportEdit (req, res) {
  const { id, name } = res.locals.company

  res
    .breadcrumb(name, `/companies/${id}`)
    .breadcrumb('Exports', `/companies/${id}/exports`)
    .breadcrumb('Edit')
    .render('companies/views/exports-edit', {
      exportDetailsLabels,
      countryOptions: metadataRepo.countryOptions.map(transformObjectToOption),
    })
}

async function handleEditFormPost (req, res, next) {
  const exportToCountries = flatten([req.body.export_to_countries])
  const futureInterestCountries = flatten([req.body.future_interest_countries])

  const data = assign({}, res.locals.company, {
    export_to_countries: filter(exportToCountries),
    future_interest_countries: filter(futureInterestCountries),
  })

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
