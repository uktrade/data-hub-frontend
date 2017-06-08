const Q = require('q')
const { isValidGuid } = require('../../lib/controller-utils')

const {
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements,
} = require('../../repos/investment.repo')

const {
  formatProjectData,
  formatValueData,
  formatRequirementsData,
  formatProjectStatusData,
} = require('../../services/investment-formatting.service')

function getLocalNavMiddleware (req, res, next) {
  res.locals.localNavItems = [
    { label: 'Project details', slug: 'details' },
    // { label: 'Project team', slug: 'team' },
    // { label: 'Interactions', slug: 'interactions' },
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
      const valueData = yield getInvestmentValue(req.session.token, req.params.id)
      const requirementsData = yield getInvestmentRequirements(req.session.token, req.params.id)

      res.locals.projectData = projectData
      res.locals.valueData = valueData
      res.locals.equityCompany = projectData.investor_company

      res.locals.investmentProject = {
        meta: formatProjectStatusData(projectData),
        details: formatProjectData(projectData),
        value: formatValueData(valueData),
        requirements: formatRequirementsData(requirementsData),
      }

      next()
    } catch (error) {
      next(error)
    }
  })
}

module.exports = {
  getLocalNavMiddleware,
  getProjectDetails,
}
