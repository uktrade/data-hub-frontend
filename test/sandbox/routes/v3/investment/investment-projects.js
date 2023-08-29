var allProjects = require('../../../fixtures/v3/investment/projects.json')
var project = require('../../../fixtures/v3/investment/project.json')
var projectAudit = require('../../../fixtures/v3/investment/project-audit.json')
var projectEvidence = require('../../../fixtures/v3/investment/project-evidence.json')
var projectNoEvidence = require('../../../fixtures/v3/investment/project-no-evidence.json')

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

exports.investmentProjectEvidence = function (req, res) {
  res.json(
    req.params.investmentId === '7ee2c85b-8ad9-46cd-8c39-9c9bef74ced0'
      ? projectNoEvidence
      : projectEvidence
  )
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
    } else if (req.body.project_assurance_adviser || req.body.project_manager) {
      res.sendStatus(200)
    }
  }

  return res.status(400).json({
    client_requirements: ['required'],
  })
}

exports.postInvestmentProject = function (req, res) {
  res.json(project)
}

exports.postInvestmentProjectEditTeams = function (req, res) {
  res.sendStatus(200).json(allProjectsMap[req.params.id] || project)
}
