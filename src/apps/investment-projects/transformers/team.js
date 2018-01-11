/* eslint-disable camelcase */
const { get } = require('lodash')

function getAdviserName (investmentData, key) {
  if (!get(investmentData, key)) {
    return 'To do'
  }

  const adviserName = get(investmentData, `${key}.first_name`, '') + ' ' + get(investmentData, `${key}.last_name`, '')
  return adviserName.trim()
}

function transformProjectManagementForView (investmentData) {
  if (investmentData.project_manager || investmentData.project_assurance_adviser) {
    return [{
      role: 'Project assurance adviser',
      adviser: getAdviserName(investmentData, 'project_assurance_adviser'),
      team: get(investmentData, 'project_assurance_team.name', null),
    }, {
      role: 'Project manager',
      adviser: getAdviserName(investmentData, 'project_manager'),
      team: get(investmentData, 'project_manager_team.name', null),
    }]
  }

  return null
}

function transformClientRelationshipManagementForView (investmentData) {
  const result = [{
    role: 'Client relationship manager',
    adviser: getAdviserName(investmentData, 'client_relationship_manager'),
    team: get(investmentData, 'client_relationship_manager.dit_team.name', null),
  }]

  const accountManager = get(investmentData, 'investor_company.account_manager.id', null)
  if (accountManager) {
    result.push({
      adviser: get(investmentData, 'investor_company.account_manager.name', null),
      role: 'Account manager',
      team: get(investmentData, 'investor_company.account_manager.dit_team.name', null),
    })
  }

  return result
}

function transformTeamMembersForView ({ adviser, role }) {
  return {
    adviser: get(adviser, 'name'),
    team: get(adviser, 'dit_team.name'),
    role: role,
  }
}

module.exports = {
  transformClientRelationshipManagementForView,
  transformProjectManagementForView,
  transformTeamMembersForView,
}
