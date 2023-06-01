const metadataRepo = require('../../../../lib/metadata')

const urls = require('../../../../lib/urls')

function getCountry(id) {
  return metadataRepo.countryOptions.find((country) => country.id === id)
}

function renderExports(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Export - ${company.name} - Companies`

  res.render('companies/apps/exports/views/index', {
    props: {
      companyId: company.id,
      localNavItems: res.locals.localNavItems,
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
      returnUrl,
      dnbRelatedCompaniesCount,
      localNavItems: res.locals.localNavItems,
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
