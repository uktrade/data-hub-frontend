const metadataRepo = require('../../../../lib/metadata')

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

module.exports = {
  renderExports,
  renderExportHistory,
}
