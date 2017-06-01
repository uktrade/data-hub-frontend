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

function transformToApi (body) {
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

  if (body['is-relationship-manager'] !== 'No') {
    project['client_relationship_manager'] = body['is-relationship-manager']
  }

  if (body['is-referral-source'] !== 'No') {
    project['referral_source_advisor'] = body['is-referral-source']
  }

  project['estimated_land_date'] = `${body['land-date_year']}-${body['land-date_month']}-01`

  delete project['land-date_year']
  delete project['land-date_month']
  delete project['is-relationship-manager']
  delete project['is-referral-source']

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

  return project
}

function transformFromApi (body) {
  const formatted = Object.assign({}, body)
  const flattenObj = [
    'client_relationship_manager',
    'referral_source_advisor',
    'referral_source_activity',
    'investor_company',
    'investment_type',
    'sector'
  ]
  const flattenArr = [
    'client_contacts',
    'business_activities'
  ]

  const date = new Date(formatted['estimated_land_date'])
  formatted['land-date_year'] = date.getFullYear()
  formatted['land-date_month'] = date.getMonth() + 1 // month is zero based index

  delete formatted['estimated_land_date']

  Object.keys(formatted).forEach((key) => {
    if (flattenObj.includes(key)) {
      formatted[key] = formatted[key].id
    } else if (flattenArr.includes(key)) {
      formatted[key] = formatted[key][0].id
    }
  })

  formatted['is-relationship-manager'] = formatted.client_relationship_manager
  formatted['is-referral-source'] = formatted.referral_source_advisor

  return formatted
}

module.exports = {
  getInvestmentDetailsDisplay,
  getOpenInvestmentProjects,
  getClosedInvestmentProjects,
  transformToApi,
  transformFromApi
}
