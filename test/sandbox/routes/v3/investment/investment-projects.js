import allProjects from '../../../fixtures/v3/investment/projects.json' with { type: 'json' }
import project from '../../../fixtures/v3/investment/project.json' with { type: 'json' }
import projectAudit from '../../../fixtures/v3/investment/project-audit.json' with { type: 'json' }
import projectEvidence from '../../../fixtures/v3/investment/project-evidence.json' with { type: 'json' }
import projectNoEvidence from '../../../fixtures/v3/investment/project-no-evidence.json' with { type: 'json' }
import projectDocumentDownload from '../../../fixtures/v3/investment/project-document-download.json' with { type: 'json' }
import projectUploadEvidence from '../../../fixtures/v3/investment/project-upload-evidence.json' with { type: 'json' }

var allProjectsMap = {}
allProjects.results.forEach(function (project) {
  allProjectsMap[project.id] = project
})

export const investmentProjectById = function (req, res) {
  res.json(allProjectsMap[req.params.id] || project)
}

export const investmentProjects = function (req, res) {
  res.json(allProjects)
}

export const investmentProjectAudit = function (req, res) {
  res.json(projectAudit)
}

export const investmentProjectEvidence = function (req, res) {
  res.json(
    req.params.investmentId === '7ee2c85b-8ad9-46cd-8c39-9c9bef74ced0'
      ? projectNoEvidence
      : projectEvidence
  )
}

export const investmentProjectEvidenceUpload = function (req, res) {
  res.json(projectUploadEvidence)
}

export const investmentProjectEvidenceUploadCallback = function (req, res) {
  res.sendStatus(200)
}

export const deleteInvestmentProjectEvidence = function (req, res) {
  res.sendStatus(200)
}

export const documentDownload = function (req, res) {
  res.json(projectDocumentDownload)
}

export const patchInvestmentProject = function (req, res) {
  const project = allProjectsMap[req.params.id]

  // if the project is at the prospect stage, there are no fields that are required
  if (project?.stage.name === 'prospect' || req.body?.stage === 'prospect') {
    return res.sendStatus(200)
  } else {
    if (req.body) {
      if (req.body.associated_non_fdi_r_and_d_project) {
        res.sendStatus(200)
      } else if (req.body.client_requirements) {
        res.sendStatus(200)
      } else if (
        req.body.project_assurance_adviser ||
        req.body.project_manager
      ) {
        res.sendStatus(200)
      }
    }

    return res.status(400).json({
      client_requirements: ['required'],
    })
  }
}

export const postInvestmentProject = function (req, res) {
  res.json(project)
}

export const postInvestmentProjectEditTeams = function (req, res) {
  res.sendStatus(200).json(allProjectsMap[req.params.id] || project)
}
