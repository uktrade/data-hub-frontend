const { get } = require('lodash')

const { isValidGuid } = require('../../../lib/controller-utils')
const { getInteraction } = require('../../interactions/repos')
const { getDitCompany } = require('../../companies/repos')
const { transformFromApi } = require('../../interactions/services/formatting')
const { buildCompanyUrl } = require('../../companies/services/data')
const { getInvestment } = require('../repos')

function handleEmptyMiddleware (req, res, next) {
  if (req.path === '/') {
    return res.redirect(`/investment-projects/create`)
  }
  next()
}

function getLocalNavMiddleware (req, res, next) {
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
    const investorCompany = await getDitCompany(req.session.token, get(investmentData, 'investor_company.id'))
    const ukCompanyId = get(investmentData, 'uk_company.id')

    investmentData.investor_company = Object.assign({}, investmentData.investor_company, investorCompany)

    if (ukCompanyId) {
      const companyDetails = await getDitCompany(req.session.token, ukCompanyId)
      investmentData.uk_company = Object.assign({}, investmentData.uk_company, companyDetails)
    }

    res.locals.investmentData = investmentData
    res.locals.equityCompany = investmentData.investor_company

    res.locals.investmentStatus = {
      id: investmentData.id,
      projectCode: investmentData.project_code,
      stageName: investmentData.stage.name,
      valuation: investmentData.value_complete ? 'Project valued' : 'Not yet valued',
      company: {
        name: investmentData.investor_company.name,
        url: buildCompanyUrl(investmentData.investor_company),
      },
    }

    res.breadcrumb({
      name: investmentData.name,
      url: `/investment-projects/${investmentData.id}`,
    })

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
