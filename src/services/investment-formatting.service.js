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

module.exports = { getInvestmentDetailsDisplay, getOpenInvestmentProjects, getClosedInvestmentProjects }
