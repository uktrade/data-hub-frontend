const { getInteractionsForInvestment } = require('../../interactions/repos')
const { transformInteractionToListItem } = require('../../interactions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')
const { getInvestment } = require('../repos')

async function getInteractionCollection (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.investmentId

    res.locals.interactions = await getInteractionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function setInteractionsReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/interactions/`
  next()
}

function setInteractionsEntityName (req, res, next) {
  res.locals.entityName = res.locals.investmentData.name
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
  getInteractionCollection,
  setInteractionsReturnUrl,
  setInteractionsEntityName,
  setCompanyDetails,
}
