const { isValidGuid } = require('../../lib/controller-utils')

const { getInteraction } = require('../../apps/interactions/interactions.repo')
const { getAdviser } = require('../../repos/adviser.repo')
const { transformFromApi } = require('../../apps/interactions/services/formatting.service')
const {
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements,
  getInvestmentTeam,
} = require('../../repos/investment.repo')

function getLocalNavMiddleware (req, res, next) {
  res.locals.localNavItems = [
    { label: 'Project details', slug: 'details' },
    { label: 'Project team', slug: 'team' },
    { label: 'Interactions', slug: 'interactions' },
    // { label: 'Evaluation', slug: 'evaluation' },
    { label: 'Audit history', slug: 'audit' },
  ]
  next()
}

async function getProjectDetails (req, res, next, id = req.params.id) {
  if (!isValidGuid(id)) {
    return next()
  }
  try {
    const projectData = await getInvestmentProjectSummary(req.session.token, req.params.id)
    const valueData = await getInvestmentValue(req.session.token, req.params.id)
    res.locals.requirementsData = await getInvestmentRequirements(req.session.token, req.params.id)
    res.locals.teamData = await getInvestmentTeam(req.session.token, req.params.id)
    res.locals.projectData = projectData
    res.locals.valueData = valueData
    res.locals.equityCompany = projectData.investor_company

    res.locals.projectData.referral_source_adviser = await getAdviser(req.session.token, projectData.referral_source_adviser.id)
    res.locals.projectData.client_relationship_manager = await getAdviser(req.session.token, projectData.client_relationship_manager.id)

    res.locals.projectStatus = {
      id: projectData.id,
      projectCode: projectData.project_code,
      phaseName: projectData.phase.name,
      valuation: valueData.value_complete ? 'Project valued' : 'Not yet valued',
    }

    res.locals.title = [projectData.name, 'Investments', projectData.investor_company.name]

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
  getLocalNavMiddleware,
  getProjectDetails,
  getInteractionDetails,
}
