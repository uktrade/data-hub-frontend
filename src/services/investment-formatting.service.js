const moment = require('moment')
const { mapValues, get } = require('lodash')
const { buildCompanyUrl } = require('./company.service')

function getInvestmentDetailsDisplay (investmentSummary) {
  if (!investmentSummary.id || !investmentSummary.investment_tier || investmentSummary.investment_tier.length === 0) return null

  const result = {}
  result.account_management_tier = investmentSummary.investment_tier

  if (investmentSummary.investment_account_manager) {
    result.investment_account_manager = `<a href="/adviser/${investmentSummary.investment_account_manager.id}/">${investmentSummary.investment_account_manager.name}</a>`
  }
  if (investmentSummary.client_relationship_manager) {
    result.client_relationship_manager = `<a href="/adviser/${investmentSummary.client_relationship_manager.id}/">${investmentSummary.client_relationship_manager.name}</a>`
  }

  result.ownership = investmentSummary.ownership

  if (investmentSummary.ownership === 'uk') {
    result.ownership = 'UK Owned'
  } else if (investmentSummary.ownership === 'both') {
    result.ownership = 'Both UK and Foreign owned'
  } else {
    result.ownership = `${investmentSummary.ownership_country} owned`
  }

  return result
}

function getOpenInvestmentProjects (investmentProjects) {
  if (!investmentProjects) return null

  return investmentProjects
    .filter(project => project.open)
    .map((project) => {
      return {
        name: `<a href="/investmentprojects/${project.id}/">${project.name}</a>`,
        value: project.value,
        state: project.state,
        land_date: formatLongDate(project.land_date),
      }
    })
}
function getClosedInvestmentProjects (investmentProjects) {
  if (!investmentProjects) return null

  return investmentProjects
    .filter(project => !project.open)
    .map((project) => {
      return {
        name: `<a href="/investmentprojects/${project.id}/">${project.name}</a>`,
        value: project.value,
        state: project.state,
        state_date: formatLongDate(project.state_date),
      }
    })
}

function transformToApi (body) {
  const schema = {
    'client_relationship_manager': Object,
    'referral_source_adviser': Object,
    'referral_source_activity': Object,
    'referral_source_activity_marketing': Object,
    'referral_source_activity_website': Object,
    'investor_company': Object,
    'investment_type': Object,
    'fdi_type': Object,
    'non_fdi_type': Object,
    'sector': Object,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const relationshipMgr = body['is-relationship-manager']
  if (relationshipMgr !== 'No') {
    body.client_relationship_manager = relationshipMgr
  }

  const referralSource = body['is-relationship-manager']
  if (referralSource !== 'No') {
    body.referral_source_adviser = referralSource
  }

  const formatted = mapValues(schema, (type, key) => {
    const value = body[key]

    if (!value) {
      return
    }

    if (type === Array) {
      return [{ id: value }]
    }

    return { id: value }
  })

  formatted['estimated_land_date'] = `${body['land-date_year']}-${body['land-date_month']}-01`

  return Object.assign({}, body, formatted)
}

function transformFromApi (body) {
  const schema = {
    'client_relationship_manager': String,
    'referral_source_adviser': String,
    'referral_source_activity': String,
    'investor_company': String,
    'investment_type': String,
    'sector': String,
    'client_contacts': Array,
    'business_activities': Array,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Array) {
      return get(body, `${key}[0].id`, '')
    }
    return get(body, `${key}.id`)
  })

  const date = new Date(body['estimated_land_date'])
  formatted['land-date_year'] = date.getFullYear()
  formatted['land-date_month'] = date.getMonth() + 1 // month is zero based index

  return Object.assign({}, body, formatted)
}

function formatProjectData (data) {
  return {
    'Client': {
      name: data.investor_company.name,
      url: buildCompanyUrl(data.investor_company),
    },
    'Type of investment': data.investment_type.name,
    'Primary sector': data.sector,
    'Sub-sector': null,
    'Business activity': data.business_activity,
    'Project description': data.description,
    'Non-disclosure agreement': data.nda_signed ? 'Signed' : 'Not signed',
    'Shareable with UK partners': null,
    'Anonymous description': null,
    'Estimated land date': data.estimated_land_date ? moment(data.estimated_land_date).format('MMMM YYYY') : null,
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
    'Export revenue': data.export_revenue,
  }
}

function formatRequirementsData (data) {
  return {
    'Main strategic drivers': data.strategic_drivers,
    'Client requirements': data.client_requirements,
    'Competitor countries': data.competitor_countries,
    'Possible UK locations': data.uk_region_locations,
    'Investment location': null,
    'UK recipient company': data.uk_company,
  }
}

function formatProjectStatusData (data) {
  return {
    id: data.id,
    name: data.name,
    projectCode: data.project_code,
    phaseName: data.phase.name,
  }
}

module.exports = {
  getInvestmentDetailsDisplay,
  getOpenInvestmentProjects,
  getClosedInvestmentProjects,
  formatProjectData,
  formatValueData,
  formatRequirementsData,
  formatProjectStatusData,
  transformToApi,
  transformFromApi,
}
