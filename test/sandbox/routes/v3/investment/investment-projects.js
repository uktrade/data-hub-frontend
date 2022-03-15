var allProjects = require('../../../fixtures/v3/investment/projects.json')
var project = require('../../../fixtures/v3/investment/project.json')
var projectAudit = require('../../../fixtures/v3/investment/project-audit.json')
var notificationSettings = require('../../../fixtures/v3/investment/notification.json')
var notificationSettingsEmpty = require('../../../fixtures/v3/investment/notification-empty.json')

const NOTIFICATION_SETTINGS_ALL_PROJECT_ID =
  '39588dd2-e643-43fa-9141-6e7beb52c140'
const NOTIFICATION_SETTINGS_EMPTY_PROJECT_ID =
  '161c7f52-662b-45c3-8ade-8e9a04aaf3c1'

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
    } else if (req.body.project_assurance_adviser || req.body.project_manager) {
      res.sendStatus(200)
    }
  }

  return res.json(400, {
    client_requirements: ['required'],
  })
}

exports.postInvestmentProject = function (req, res) {
  res.json(project)
}

exports.postInvestmentProjectEditTeams = function (req, res) {
  res.sendStatus(200).json(allProjectsMap[req.params.id] || project)
}

exports.getInvestmentNotificationSettings = function (req, res) {
  if (req.params.id == NOTIFICATION_SETTINGS_ALL_PROJECT_ID) {
    res.json(notificationSettings)
    return
  }
  if (req.params.id == NOTIFICATION_SETTINGS_EMPTY_PROJECT_ID) {
    res.json(notificationSettingsEmpty)
    return
  }
  // The API currently returns an empty notification object for all projects
  res.json(notificationSettingsEmpty)
}
