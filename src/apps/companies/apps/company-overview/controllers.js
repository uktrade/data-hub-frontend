const urls = require('../../../../lib/urls')

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

  const props = {
    breadcrumbs,
    company,
    localNavItems: res.locals.localNavItems,
    urls,
  }

  res.render('companies/apps/company-overview/views/client-container', {
    props,
  })
}

module.exports = {
  renderOverview,
}
