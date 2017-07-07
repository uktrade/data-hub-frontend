const { isValidGuid } = require('../../../lib/controller-utils')

const { getInteraction } = require('../../interactions/repos')
const { transformFromApi } = require('../../interactions/services/formatting')
const { getInvestment } = require('../repos')

function handleEmptyMiddleware (req, res, next) {
  if (req.path === '/') {
    return res.redirect(`/investment-projects/create`)
  }
  next()
}

function getLocalNavMiddleware (req, res, next) {
  req.breadcrumbs('Project details')
  res.locals.localNavItems = [
    { label: 'Project details', slug: 'details' },
    { label: 'Project team', slug: 'team' },
    { label: 'Interactions', slug: 'interactions' },
    { label: 'Evaluation', slug: 'evaluation' },
    { label: 'Audit history', slug: 'audit' },
  ]
  next()
}

async function getInvestmentDetails (req, res, next, id = req.params.id) {
  if (!isValidGuid(id)) {
    return next()
  }
  try {
    const investmentData = await getInvestment(req.session.token, req.params.id)

    res.locals.investmentData = investmentData
    res.locals.equityCompany = investmentData.investor_company

    res.locals.investmentStatus = {
      id: investmentData.id,
      projectCode: investmentData.project_code,
      phaseName: investmentData.phase.name,
      valuation: investmentData.value_complete ? 'Project valued' : 'Not yet valued',
    }

    res.locals.title = [investmentData.name, 'Investments', investmentData.investor_company.name]

    next()
  } catch (error) {
    next(error)
  }
}

async function getInteractionDetails (req, res, next, interactionId = req.params.interactionId) {
  if (!isValidGuid(interactionId)) {
    return next()
  }
  try {
    const interactionResponse = await getInteraction(req.session.token, interactionId)

    res.locals.interaction = transformFromApi(interactionResponse)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleEmptyMiddleware,
  getLocalNavMiddleware,
  getInvestmentDetails,
  getInteractionDetails,
}
