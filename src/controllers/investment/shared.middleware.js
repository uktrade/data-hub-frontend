const Q = require('q')
const { isValidGuid } = require('../../lib/controller-utils')

const { getInteraction } = require('../../repos/interaction.repo')
const { getAdviser } = require('../../repos/adviser.repo')
const { transformFromApi } = require('../../services/interaction-formatting.service')
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

function getProjectDetails (req, res, next, id = req.params.id) {
  if (!isValidGuid(id)) {
    return next()
  }
  Q.spawn(function * () {
    try {
      const projectData = yield getInvestmentProjectSummary(req.session.token, req.params.id)
      res.locals.valueData = yield getInvestmentValue(req.session.token, req.params.id)
      res.locals.requirementsData = yield getInvestmentRequirements(req.session.token, req.params.id)
      res.locals.teamData = yield getInvestmentTeam(req.session.token, req.params.id)
      res.locals.projectData = projectData
      res.locals.equityCompany = projectData.investor_company

      res.locals.projectData.referral_source_adviser = yield getAdviser(req.session.token, projectData.referral_source_adviser.id)
      res.locals.projectData.client_relationship_manager = yield getAdviser(req.session.token, projectData.client_relationship_manager.id)

      res.locals.projectStatus = {
        id: projectData.id,
        projectCode: projectData.project_code,
        phaseName: projectData.phase.name,
      }

      res.locals.title = [projectData.name, 'Investments', projectData.investor_company.name]

      next()
    } catch (error) {
      next(error)
    }
  })
}

function getInteractionDetails (req, res, next, interactionId = req.params.interactionId) {
  if (!isValidGuid(interactionId)) {
    return next()
  }
  Q.spawn(function * () {
    try {
      const interactionResponse = yield getInteraction(req.session.token, interactionId)

      res.locals.interaction = transformFromApi(interactionResponse)

      next()
    } catch (error) {
      next(error)
    }
  })
}

module.exports = {
  getLocalNavMiddleware,
  getProjectDetails,
  getInteractionDetails,
}
