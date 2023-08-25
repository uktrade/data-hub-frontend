import { apiProxyAxios } from '../../../components/Task/utils'
import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from './constants'
import { transformOneListTiers } from './transformers'

export async function getOneListDetails(companyId) {
  return Promise.all([
    apiProxyAxios.get(`v4/company/${companyId}`),
    apiProxyAxios.get('v4/metadata/one-list-tier'),
    apiProxyAxios.get(`v4/company/${companyId}/one-list-group-core-team`),
  ]).then(
    ([{ data: company }, { data: oneListTiers }, { data: oneListTeam }]) => ({
      company: company,
      oneListTiers: transformOneListTiers(oneListTiers),
      oneListTeam: oneListTeam,
    })
  )
}

export async function saveOneListDetails({ values, companyId }) {
  async function assignOneListTierandGlobalManagerRequest() {
    return await apiProxyAxios.post(
      `v4/company/${companyId}/assign-one-list-tier-and-global-account-manager`,
      {
        [ACCOUNT_MANAGER_FIELD_NAME]: values[ACCOUNT_MANAGER_FIELD_NAME].value,
        [TIER_FIELD_NAME]: values[TIER_FIELD_NAME],
      }
    )
  }

  async function removeFromOneList() {
    return await apiProxyAxios.post(
      `v4/company/${companyId}/remove-from-one-list`
    )
  }

  async function assignCoreTeamRequest() {
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

  async function removeCoreTeamRequest() {
    return await apiProxyAxios.patch(
      `v4/company/${companyId}/update-one-list-core-team`,
      {
        [ONE_LIST_TEAM_FIELD_NAME]: [],
      }
    )
  }

  let request

  if (values[TIER_FIELD_NAME] === NONE) {
    request = removeCoreTeamRequest().then(removeFromOneList)
  } else if (!values[ONE_LIST_TEAM_FIELD_NAME]) {
    request = Promise.all([
      assignOneListTierandGlobalManagerRequest(),
      removeCoreTeamRequest(),
    ])
  } else {
    request = Promise.all([
      assignOneListTierandGlobalManagerRequest(),
      assignCoreTeamRequest(),
    ])
  }

  let response
  try {
    response = await request
  } catch (e) {
    response = await Promise.reject(
      e.message ||
        (e.errors &&
          e.errors.one_list_tier &&
          Object.values(e.errors.one_list_tier).join(', ')) ||
        e.toString()
    )
  }
  response.data
}
