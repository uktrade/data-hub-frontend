const { getInvestment } = require('../repos')

function setInteractionsDetails (req, res, next) {
  res.locals.interactions = {
    returnLink: `/investment-projects/${req.params.investmentId}/interactions/`,
    entityName: res.locals.investment.name,
    query: { investment_project_id: req.params.investmentId },
    view: 'investment-projects/views/interactions',
    createKind: 'interaction',
    canAdd: true,
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
