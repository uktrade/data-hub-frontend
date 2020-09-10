const { getInvestment } = require('../repos')

function setPropositionsReturnUrl(req, res, next) {
  const { projects } = res.locals.paths
  const { investmentId } = req.params

  res.locals.returnLink = `${projects}/${investmentId}/propositions`
  next()
}

function setPropositionsEntityName(req, res, next) {
  res.locals.entityName = res.locals.investment.name
  next()
}

async function setCompanyDetailsWithPropositions(req, res, next) {
  try {
    const investment = await getInvestment(req, req.params.investmentId)
    res.locals.company = investment.investor_company
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setPropositionsReturnUrl,
  setPropositionsEntityName,
  setCompanyDetailsWithPropositions,
}
