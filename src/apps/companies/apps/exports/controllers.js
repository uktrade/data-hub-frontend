/* eslint-disable camelcase */
const { filter, flatten, get, set } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const urls = require('../../../../lib/urls')
const groupExportCountries = require('../../../../lib/group-export-countries')
const getExportCountries = require('../../../../lib/get-export-countries')

const { updateCompany, saveCompanyExportDetails } = require('../../repos')
const { transformObjectToOption } = require('../../../transformers')
const { transformCompanyToExportDetailsView } = require('./transformer')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')

const {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
} = require('../../../constants')

function getId(obj) {
  return obj.id
}

function getExportCountryGroups(countries = []) {
  const buckets = groupExportCountries(countries)

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    buckets[status] = buckets[status].map(transformObjectToOption)
  })

  return buckets
}

function getCountry(id) {
  return metadataRepo.countryOptions.find((country) => country.id === id)
}

function getPostedFormData(body) {
  const data = {
    export_experience_category: body.export_experience_category,
  }

  EXPORT_INTEREST_STATUS_VALUES.forEach((status) => {
    const options = []
      .concat(body[status])
      .filter((value) => value && value.length > 0)
    if (options.length) {
      data[status] = options.map(getCountry).map(transformObjectToOption)
    }
  })

  return data
}

function renderExports(req, res) {
  const { company } = res.locals

  const isArchived = res.locals.company.archived

  const {
    exportWinCategory,
    greatProfile,
    exportPotential,
    exportCountriesInformation,
  } = transformCompanyToExportDetailsView(company)

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports')
    .render('companies/apps/exports/views/index', {
      props: {
        isArchived,
        exportWinCategory,
        greatProfile,
        exportPotential,
        exportCountriesInformation,
        exportPotentials: Object.values(exportPotentialLabels),
        companyId: company.id,
        companyNumber: company.company_number,
      },
    })
}

async function renderFullExportHistory(req, res) {
  const {
    company: { name, id },
  } = res.locals

  res
    .breadcrumb(name, urls.companies.detail(id))
    .breadcrumb('Exports', urls.companies.exports.index(id))
    .breadcrumb('Full export history')
    .render('companies/apps/exports/views/full-history', {
      props: {
        companyId: id,
      },
    })
}

function populateExportForm(req, res, next) {
  const { export_experience_category, export_countries } = res.locals.company

  res.locals.formData = Object.assign(
    {
      export_experience_category,
      ...getExportCountryGroups(export_countries),
    },
    req.method === 'POST' ? getPostedFormData(req.body) : {}
  )

  next()
}

function renderExportEdit(req, res) {
  const { company, features, errors } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit')
    .render('companies/apps/exports/views/edit', {
      errors: errors || [],
      exportDetailsLabels,
      exportExperienceCategories: metadataRepo.exportExperienceCategory.map(
        transformObjectToOption
      ),
      countryOptions: metadataRepo.countryOptions.map(transformObjectToOption),
      countriesFields: {
        [EXPORT_INTEREST_STATUS.EXPORTING_TO]:
          exportDetailsLabels.exportToCountries,
        [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]:
          exportDetailsLabels.futureInterestCountries,
        [EXPORT_INTEREST_STATUS.NOT_INTERESTED]:
          exportDetailsLabels.noInterestCountries,
      },
    })
}

async function handleEditFormPost(req, res, next) {
  const { token } = req.session
  const companyId = res.locals.company.id

  try {
    await saveCompanyExportDetails(token, companyId, {
      export_countries: getExportCountries(req.body) || [],
    })

    await updateCompany(token, companyId, {
      export_experience_category: req.body.export_experience_category,
    })

    res.redirect(urls.companies.exports.index(companyId))
  } catch (err) {
    if (err.statusCode !== 400) {
      return next(err)
    }

    const nonFieldErrors = get(err.error, 'non_field_errors')

    if (nonFieldErrors) {
      set(res.locals, 'errors.nonField', nonFieldErrors)
    }

    next()
  }
}

module.exports = {
  populateExportForm,
  renderExports,
  renderExportEdit,
  handleEditFormPost,
  renderFullExportHistory,
}
