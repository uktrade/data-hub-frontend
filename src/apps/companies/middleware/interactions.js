const urls = require('../../../lib/urls')
const queryString = require('qs')
const { URL } = require('url')

function setInteractionsDetails(req, res, next) {
  const { company } = res.locals

  if (req.path === '/') {
    const url = new URL(
      urls.companies.activity.index(company.id),
      `${req.protocol}://${req.get('host')}`
    )
    url.search = new URLSearchParams(queryString.stringify(req.query))
    return res.redirect(301, url)
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
