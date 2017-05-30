const {formatLongDate} = require('../lib/date')

function getInvestmentDetailsDisplay (investmentSummary) {
  if (!investmentSummary.id || !investmentSummary.investment_tier || investmentSummary.investment_tier.length === 0) return null

  const result = {}
  result.account_management_tier = investmentSummary.investment_tier

  if (investmentSummary.investment_account_manager) {
    result.investment_account_manager = `<a href="/advisor/${investmentSummary.investment_account_manager.id}/">${investmentSummary.investment_account_manager.name}</a>`
  }
  if (investmentSummary.client_relationship_manager) {
    result.client_relationship_manager = `<a href="/advisor/${investmentSummary.client_relationship_manager.id}/">${investmentSummary.client_relationship_manager.name}</a>`
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
        land_date: formatLongDate(project.land_date)
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
        state_date: formatLongDate(project.state_date)
      }
    })
}

function transformForApi (body) {
  const project = Object.assign({}, body)
  const transformToObject = [
    'client_relationship_manager',
    'referral_source_advisor',
    'referral_source_activity',
    'investor_company',
    'investment_type',
    'sector'
  ]
  const transformToArray = [
    'client_contacts',
    'business_activities'
  ]

  if (body['is-relationship-manager']) {
    project['client_relationship_manager'] = body['is-relationship-manager']
  }

  if (body['is-referral-source']) {
    project['referral_source_advisor'] = body['is-referral-source']
  }

  Object.keys(project).forEach((key) => {
    if (transformToObject.includes(key)) {
      project[key] = {
        id: project[key]
      }
    } else if (transformToArray.includes(key)) {
      project[key] = [{
        id: project[key]
      }]
    }
  })

  project['estimated_land_date'] = `${body['land-date_year']}-${body['land-date_month']}-01`

  delete project['land-date_year']
  delete project['land-date_month']
  delete project['is-relationship-manager']
  delete project['is-referral-source']

  return project
}

module.exports = {
  getInvestmentDetailsDisplay,
  getOpenInvestmentProjects,
  getClosedInvestmentProjects,
  transformForApi
}
