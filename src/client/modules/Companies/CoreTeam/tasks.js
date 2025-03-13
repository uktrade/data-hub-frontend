import { apiProxyAxios } from '../../../components/Task/utils'
import { canEditOneListTierAndGlobalAccountManager } from '../CompanyBusinessDetails/utils'
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
  companyId,
  values,
  userPermissions,
}) {
  if (canEditOneListTierAndGlobalAccountManager(userPermissions)) {
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
  companyId,
  userPermissions = NONE,
}) {
  let request

  if (values[TIER_FIELD_NAME] === NONE) {
    request = removeCoreTeamRequest({ companyId, values }).then(
      removeFromOneList({ companyId })
    )
  } else if (!values[ONE_LIST_TEAM_FIELD_NAME]) {
    request = Promise.all([
      assignOneListTierandGlobalManagerRequest({
        companyId,
        values,
        userPermissions,
      }),
      removeCoreTeamRequest({ companyId }),
    ])
  } else {
    request = Promise.all([
      assignOneListTierandGlobalManagerRequest({
        companyId,
        values,
        userPermissions,
      }),
      assignCoreTeamRequest({ companyId, values }),
    ])
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
