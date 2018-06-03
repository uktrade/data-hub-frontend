const { getPropositionsForInvestment } = require('../../propositions/repos')
const { transformPropositionToListItem } = require('../../propositions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')
const { getInvestment } = require('../repos')

async function getPropositionCollection (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.investmentId

    res.locals.propositions = await getPropositionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'proposition' },
        transformPropositionToListItem
      ))

    next()
  } catch (error) {
    next(error)
  }
}

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
  getPropositionCollection,
  setPropositionsReturnUrl,
  setPropositionsEntityName,
  setCompanyDetailsWithPropositions,
}
