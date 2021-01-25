var allProjects = require('../../../fixtures/v3/investment/projects.json')
var project = require('../../../fixtures/v3/investment/project.json')
var projectAudit = require('../../../fixtures/v3/investment/project-audit.json')

var allProjectsMap = {}
allProjects.results.forEach(function (project) {
  allProjectsMap[project.id] = project
})

exports.investmentProjectById = function (req, res) {
  res.json(allProjectsMap[req.params.id] || project)
}

exports.investmentProjects = function (req, res) {
  res.json(allProjects)
}

exports.investmentProjectAudit = function (req, res) {
  res.json(projectAudit)
}

exports.patchInvestmentProject = function (req, res) {
  if (req.body) {
    if (req.body.associated_non_fdi_r_and_d_project) {
      res.sendStatus(200)
    } else if (
      req.body.client_requirements &&
      req.body.client_requirements.length
    ) {
      res.sendStatus(200)
    }
  }

  return res.json(400, {
    client_requirements: ['required'],
  })
}
