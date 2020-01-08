/* eslint-disable camelcase */
const { get } = require('lodash')

function getAdviserName(investment, key) {
  if (!get(investment, key)) {
    return 'To do'
  }

  const adviserName =
    get(investment, `${key}.first_name`, '') +
    ' ' +
    get(investment, `${key}.last_name`, '')
  return adviserName.trim()
}

function transformProjectManagementForView(investment) {
  if (investment.project_manager || investment.project_assurance_adviser) {
    return [
      {
        role: 'Project Assurance Adviser',
        adviser: getAdviserName(investment, 'project_assurance_adviser'),
        team: get(investment, 'project_assurance_team.name', null),
      },
      {
        role: 'Project Manager',
        adviser: getAdviserName(investment, 'project_manager'),
        team: get(investment, 'project_manager_team.name', null),
      },
    ]
  }

  return null
}

function transformClientRelationshipManagementForView(investment) {
  const result = [
    {
      role: 'Client Relationship Manager',
      adviser: getAdviserName(investment, 'client_relationship_manager'),
      team: get(investment, 'client_relationship_manager.dit_team.name'),
    },
  ]
  const globalAccountManager = get(
    investment,
    'investor_company.one_list_group_global_account_manager.id'
  )
  if (globalAccountManager) {
    const firstName = get(
      investment,
      'investor_company.one_list_group_global_account_manager.first_name'
    )
    const lastName = get(
      investment,
      'investor_company.one_list_group_global_account_manager.last_name'
    )
    const team = get(
      investment,
      'investor_company.one_list_group_global_account_manager.dit_team.name'
    )
    result.push({
      team,
      adviser: `${firstName} ${lastName}`,
      role: 'Global Account Manager',
    })
  }

  return result
}

function transformTeamMembersForView({ adviser, role }) {
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
