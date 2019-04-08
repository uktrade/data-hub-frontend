const { getInvestment } = require('../repos')

function setInteractionsDetails (req, res, next) {
  const { projects } = res.locals.paths
  const { name } = res.locals.investment
  const { investmentId } = req.params

  res.locals.interactions = {
    returnLink: `${projects}/${investmentId}/interactions/`,
    entityName: name,
    query: { investment_project_id: investmentId },
    view: 'investments/views/interactions',
    createKind: 'interaction',
    canAdd: true,
    showCompany: true,
  }

  next()
}

async function setCompanyDetails (req, res, next) {
  try {
    const investment = await getInvestment(req.session.token, req.params.investmentId)
    res.locals.company = investment.investor_company
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setInteractionsDetails,
  setCompanyDetails,
}
