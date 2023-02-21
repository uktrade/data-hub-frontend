const urls = require('../../../lib/urls')

function renderOrders(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Orders - ${company.name} - Companies`

  res.render('companies/views/orders', {
    props: {
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Orders (OMIS)' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

module.exports = {
  renderOrders,
}
