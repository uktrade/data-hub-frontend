const urls = require('../../../../lib/urls')

const {
  transformCompanyToExportDetailsView,
} = require('../exports/transformer')

async function renderOverview(req, res) {
  const { company } = res.locals

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { link: urls.companies.detail(company.id), text: company.name },
    { text: 'Overview' },
  ]

  const companiesHouseLink = urls.external.companiesHouse(
    company.company_number
  )

  const { exportCountriesInformation } =
    transformCompanyToExportDetailsView(company)

  const maximumTenCountries = (countries, maxCount) =>
    countries.slice(0, maxCount)

  const numberOfCurrentExportCountries =
    exportCountriesInformation[0]?.values?.length || 0
  const maximumTenCurrentExportCountries = maximumTenCountries(
    exportCountriesInformation[0]?.values || [],
    10
  )

  const numberOfFutureInterestCountries =
    exportCountriesInformation[1]?.values?.length || 0
  const maximumTenFutureInterestCountries = maximumTenCountries(
    exportCountriesInformation[1]?.values || [],
    10
  )

  res.render('companies/apps/company-overview/views/client-container', {
    props: {
      breadcrumbs,
      company,
      localNavItems: res.locals.localNavItems,
      urls,
      companiesHouseLink,
      exportCountriesInformation,
      numberOfCurrentExportCountries,
      maximumTenCurrentExportCountries,
      numberOfFutureInterestCountries,
      maximumTenFutureInterestCountries,
    },
  })
}

module.exports = {
  renderOverview,
}
