function setInteractionsDetails(req, res, next) {
  const { projects } = res.locals.paths
  const { name } = res.locals.investment
  const { investmentId } = req.params

  res.locals.interactions = {
    returnLink: `${projects}/${investmentId}/interactions/`,
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
