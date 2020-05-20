const urls = require('../../../lib/urls')

function setInteractionsDetails(req, res, next) {
  const { company } = res.locals

  if (req.path === '/') {
    return res.redirect(301, 'activity')
  }

  res.locals.interactions = {
    view: 'companies/views/interactions',
    returnLink: urls.companies.interactions.index(company.id),
    entityName: company.name,
    query: { company_id: company.id },
    canAdd: !company.archived,
    showCompany: false,
    breadcrumbs: [
      {
        text: company.name,
        href: urls.companies.detail(company.id),
      },
      {
        text: 'Interactions',
        href: urls.companies.interactions.index(company.id),
      },
    ],
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
