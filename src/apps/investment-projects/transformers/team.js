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
    team: get(investmentData, 'client_relationship_manager.dit_team.name'),
  }]
  const globalAccountManager = get(investmentData, 'investor_company.one_list_group_global_account_manager.id')
  if (globalAccountManager) {
    const firstName = get(investmentData, 'investor_company.one_list_group_global_account_manager.first_name')
    const lastName = get(investmentData, 'investor_company.one_list_group_global_account_manager.last_name')
    const team = get(investmentData, 'investor_company.one_list_group_global_account_manager.dit_team.name')
    result.push({
      team,
      adviser: `${firstName} ${lastName}`,
      role: 'Global Account Manager',
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
