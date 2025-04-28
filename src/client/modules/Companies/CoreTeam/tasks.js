import { apiProxyAxios } from '../../../components/Task/utils'
import {
  canEditOneListTierAndGlobalAccountManager,
  isOneListAccountOwner,
} from '../CompanyBusinessDetails/utils'
import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from './constants'

export async function getOneListDetails(companyId) {
  return Promise.all([
    apiProxyAxios.get(`v4/company/${companyId}`),
    apiProxyAxios.get('v4/metadata/one-list-tier'),
    apiProxyAxios.get(`v4/company/${companyId}/one-list-group-core-team`),
  ]).then(
    ([{ data: company }, { data: oneListTiers }, { data: oneListTeam }]) => ({
      company,
      oneListTiers,
      oneListTeam,
    })
  )
}

async function assignOneListTierandGlobalManagerRequest({
  company,
  values,
  userPermissions,
  currentAdviserId,
}) {
  const companyId = company.id
  if (
    canEditOneListTierAndGlobalAccountManager(userPermissions) ||
    isOneListAccountOwner(company, currentAdviserId)
  ) {
    return await apiProxyAxios.post(
      `v4/company/${companyId}/assign-one-list-tier-and-global-account-manager`,
      {
        [ACCOUNT_MANAGER_FIELD_NAME]: values[ACCOUNT_MANAGER_FIELD_NAME].value,
        [TIER_FIELD_NAME]: values[TIER_FIELD_NAME],
      }
    )
  }
}

async function removeFromOneList({ companyId }) {
  return await apiProxyAxios.post(
    `v4/company/${companyId}/remove-from-one-list`
  )
}

async function assignCoreTeamRequest({ companyId, values }) {
  const one_list_team = values[ONE_LIST_TEAM_FIELD_NAME].map((member) => ({
    adviser: member.value,
  }))

  return await apiProxyAxios.patch(
    `v4/company/${companyId}/update-one-list-core-team`,
    {
      [ONE_LIST_TEAM_FIELD_NAME]: one_list_team,
    }
  )
}

async function removeCoreTeamRequest({ companyId }) {
  return await apiProxyAxios.patch(
    `v4/company/${companyId}/update-one-list-core-team`,
    {
      [ONE_LIST_TEAM_FIELD_NAME]: [],
    }
  )
}

export async function saveOneListDetails({
  values,
  company,
  userPermissions = NONE,
  currentAdviserId,
}) {
  let request
  const companyId = company.id

  /* 
  A Global account manager can replace themselves with another user.
  In the edge case where they also make changes to the Advisers on the core team ensure the 
  call order is:
  1. update-one-list-core-team
  2. assign-one-list-tier-and-global-account-manager
  This will avoid the update-one-list-core-team failing due to lack of permissions.
  */
  if (values[TIER_FIELD_NAME] === NONE) {
    request = removeCoreTeamRequest({ companyId, values }).then(
      removeFromOneList({ companyId })
    )
  } else if (!values[ONE_LIST_TEAM_FIELD_NAME]) {
    request = removeCoreTeamRequest({ companyId }).then(
      assignOneListTierandGlobalManagerRequest({
        company,
        values,
        userPermissions,
        currentAdviserId,
      })
    )
  } else {
    request = assignCoreTeamRequest({ companyId, values }).then(
      assignOneListTierandGlobalManagerRequest({
        company,
        values,
        userPermissions,
        currentAdviserId,
      })
    )
  }

  try {
    await request
  } catch (e) {
    await Promise.reject(
      e.message ||
        (e.errors &&
          e.errors.one_list_tier &&
          Object.values(e.errors.one_list_tier).join(', ')) ||
        e.toString()
    )
  }
}
