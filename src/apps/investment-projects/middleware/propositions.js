const { getInvestment } = require('../repos')

function setPropositionsReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/propositions/`
  next()
}

function setPropositionsEntityName (req, res, next) {
  res.locals.entityName = res.locals.investmentData.name
  next()
}

async function setCompanyDetailsWithPropositions (req, res, next) {
  try {
    const investment = await getInvestment(req.session.token, req.params.investmentId)
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
