/* eslint-disable camelcase */
const metadataRepo = require('../../../../lib/metadata')

const { transformCompanyToExportDetailsView } = require('./transformer')
const { exportPotentialLabels } = require('../../labels')
const urls = require('../../../../lib/urls')

function getCountry(id) {
  return metadataRepo.countryOptions.find((country) => country.id === id)
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

  res.locals.title = `Export - ${company.name} - Companies`

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
      localNavItems: res.locals.localNavItems,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
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
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        { link: urls.companies.detail(company.id), text: company.name },
        { link: urls.companies.exports.index(company.id), text: 'Exports' },
        { text: pageTitle },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

function renderExportEdit(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit')
    .render('companies/apps/exports/views/edit', {
      props: {
        companyId: company.id,
      },
    })
}

function renderExportEditCountries(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Exports', urls.companies.exports.index(company.id))
    .breadcrumb('Edit export countries')
    .render('companies/apps/exports/views/edit-countries', {
      props: {
        companyId: company.id,
      },
    })
}

module.exports = {
  renderExports,
  renderExportEdit,
  renderExportHistory,
  renderExportEditCountries,
}
