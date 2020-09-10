/* eslint-disable camelcase */
const { get, set } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const groupExportCountries = require('../../../../lib/group-export-countries')
const getExportCountries = require('../../../../lib/get-export-countries')

const { saveCompanyExportDetails } = require('../../repos')
const { transformObjectToOption } = require('../../../transformers')
const { transformCompanyToExportDetailsView } = require('./transformer')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const urls = require('../../../../lib/urls')

const {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
} = require('../../../constants')

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
  const data = {}

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
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  const isArchived = res.locals.company.archived

  const {
    exportWinCategory,
    greatProfile,
    exportPotential,
    exportCountriesInformation,
  } = transformCompanyToExportDetailsView(company)

  res.render('companies/apps/exports/views/index', {
    props: {
      isArchived,
      exportWinCategory,
      greatProfile,
      exportPotential,
      exportCountriesInformation,
      exportPotentials: Object.values(exportPotentialLabels),
      companyId: company.id,
      companyNumber: company.company_number,
      companyName: company.name,
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Exports' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

function renderExportHistory(req, res) {
  const { company, dnbRelatedCompaniesCount, returnUrl } = res.locals

  const { countryId } = req.params

  const pageTitle = countryId
    ? `${getCountry(countryId).name} exports history`
    : 'Export countries history'

  res.render('companies/apps/exports/views/full-history', {
    props: {
      companyId: company.id,
      pageTitle,
      countryId,
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { link: urls.companies.exports.index(company.id), text: 'Exports' },
        { text: pageTitle },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

function populateExportForm(req, res, next) {
  const { export_countries } = res.locals.company

  res.locals.formData = {
    ...getExportCountryGroups(export_countries),
    ...(req.method === 'POST' ? getPostedFormData(req.body) : {}),
  }

  next()
}

function renderExportEdit(req, res) {
  const { company } = res.locals
  const exportPotentialValue = exportPotentialLabels[company.export_potential]
  const exportWinCategoryValue = company.export_experience_category

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit')
    .render('companies/apps/exports/views/edit', {
      props: {
        companyId: company.id,
        companyNumber: company.company_number,
        exportWinCategoryValue,
        greatProfile: {
          name: exportDetailsLabels.greatProfile,
          value: company.great_profile_status,
        },
        exportPotential: {
          name: exportDetailsLabels.exportPotential,
          value: exportPotentialValue && exportPotentialValue.text,
        },
        exportWinCategories: metadataRepo.exportExperienceCategory.map(
          transformObjectToOption
        ),
      },
    })
}

function countryToTypeaheadOption(country) {
  return { value: country.id, label: country.name }
}

function countriesToTypeaheadOptions(countries = []) {
  return countries.map(countryToTypeaheadOption)
}

function renderExportEditCountries(req, res) {
  const { company } = res.locals
  const exportCountries = groupExportCountries(company.export_countries)
  const {
    EXPORTING_TO,
    FUTURE_INTEREST,
    NOT_INTERESTED,
  } = EXPORT_INTEREST_STATUS

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit export countries')
    .render('companies/apps/exports/views/edit-countries', {
      props: {
        companyId: company.id,
        countryOptions: metadataRepo.countryOptions.map(
          transformObjectToOption
        ),
        fields: [
          {
            name: EXPORTING_TO,
            label: exportDetailsLabels.exportToCountries,
            values: countriesToTypeaheadOptions(exportCountries[EXPORTING_TO]),
          },
          {
            name: FUTURE_INTEREST,
            label: exportDetailsLabels.futureInterestCountries,
            values: countriesToTypeaheadOptions(
              exportCountries[FUTURE_INTEREST]
            ),
          },
          {
            name: NOT_INTERESTED,
            label: exportDetailsLabels.noInterestCountries,
            values: countriesToTypeaheadOptions(
              exportCountries[NOT_INTERESTED]
            ),
          },
        ],
      },
    })
}

async function handleEditFormPost(req, res, next) {
  const companyId = res.locals.company.id

  try {
    await saveCompanyExportDetails(req, companyId, {
      export_countries: getExportCountries(req.body) || [],
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
  renderExportHistory,
  renderExportEditCountries,
}
