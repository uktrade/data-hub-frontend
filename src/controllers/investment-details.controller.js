const router = require('express').Router()
const Q = require('q')
const moment = require('moment')

const { buildCompanyUrl } = require('../services/company.service')
const {
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements
} = require('../repos/investment.repo')

const localNavItems = [
  { label: 'Project details', slug: 'details' },
  { label: 'Client', slug: 'client' },
  { label: 'Project team', slug: 'team' },
  { label: 'Interactions', slug: 'interactions' },
  { label: 'Documents', slug: 'documents' },
  { label: 'Evaluation', slug: 'evaluation' },
  { label: 'Audit history', slug: 'audit' }
]

function formatProjectStatusData (data) {
  return {
    id: data.id,
    name: data.name,
    projectCode: data.project_code,
    phaseName: data.phase.name
  }
}

function formatProjectData (data) {
  return {
    'Client': {
      name: data.investor_company.name,
      url: buildCompanyUrl(data.investor_company)
    },
    'Type of investment': data.investment_type.name,
    'Primary sector': data.sector,
    'Sub-sector': null,
    'Business activity': data.business_activity,
    'Project description': data.description,
    'Non-disclosure agreement': data.nda_signed ? 'Signed' : 'Not signed',
    'Shareable with UK partners': null,
    'Anonymous description': null,
    'Estimated land date': data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null
  }
}

function formatValueData (data) {
  return {
    'Total investment': data.total_investment,
    'Foreign equity investment': data.foreign_equity_investment,
    'Government assistance': data.government_assistance,
    'New jobs': data.number_new_jobs,
    'Average salary': data.average_salary,
    'Safeguarded jobs': data.number_safeguarded_jobs,
    'R&D budget': data.r_and_d_budget,
    'Non-FDI R&D project': data.non_fdi_r_and_d_budget,
    'New-to-world tech': data.new_tech_to_uk,
    'Export revenue': data.export_revenue
  }
}

function formatRequirementsData (data) {
  return {
    'Main strategic drivers': data.strategic_drivers,
    'Client requirements': data.client_requirements,
    'Competitor countries': data.competitor_countries,
    'Possible UK locations': data.uk_region_locations,
    'Investment location': null,
    'UK recipient company': data.uk_company
  }
}

function getDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const projectData = yield getInvestmentProjectSummary(req.session.token, req.params.id)
      const valueData = yield getInvestmentValue(req.session.token, req.params.id)
      const requirementsData = yield getInvestmentRequirements(req.session.token, req.params.id)

      res.render('investment/details', {
        currentNavItem: 'details',
        projectMeta: formatProjectStatusData(projectData),
        project: formatProjectData(projectData),
        value: formatValueData(valueData),
        requirements: formatRequirementsData(requirementsData),
        localNavItems
      })
    } catch (error) {
      next(error)
    }
  })
}

function redirectToDetails (req, res) {
  return res.redirect(`/investment/${req.params.id}/details`)
}

router.get('/investment/:id', redirectToDetails)
router.get('/investment/:id/details', getDetails)

module.exports = { router, getDetails }
