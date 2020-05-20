const urls = require('../../../lib/urls')

function setInteractionsDetails(req, res, next) {
  const { name } = res.locals.investment
  const { investmentId } = req.params

  res.locals.interactions = {
    returnLink: urls.investments.projects.interactions.index(investmentId),
    entityName: name,
    query: { investment_project_id: investmentId },
    view: 'investments/views/interactions',
    createKind: 'interaction',
    theme: 'investment',
    canAdd: true,
    showCompany: true,
  }

  next()
}

function setCompanyDetails(req, res, next) {
  const { investment } = res.locals
  res.locals.company = investment.investor_company
  next()
}

module.exports = {
  setInteractionsDetails,
  setCompanyDetails,
}
