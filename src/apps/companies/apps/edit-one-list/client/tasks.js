import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from '../constants'

export function saveOneListDetails({ values, companyId }) {
  function assignOneListTierandGlobalManagerRequest() {
    return apiProxyAxios.post(
      `v4/company/${companyId}/assign-one-list-tier-and-global-account-manager`,
      {
        [ACCOUNT_MANAGER_FIELD_NAME]: values[ACCOUNT_MANAGER_FIELD_NAME].value,
        [TIER_FIELD_NAME]: values[TIER_FIELD_NAME],
      }
    )
  }

  function removeFromOneList() {
    return apiProxyAxios.post(`v4/company/${companyId}/remove-from-one-list`)
  }

  function assignCoreTeamRequest() {
    const one_list_team = values[ONE_LIST_TEAM_FIELD_NAME].map((member) => ({
      adviser: member.value,
    }))

    return apiProxyAxios.patch(
      `v4/company/${companyId}/update-one-list-core-team`,
      {
        [ONE_LIST_TEAM_FIELD_NAME]: one_list_team,
      }
    )
  }

  function removeCoreTeamRequest() {
    return apiProxyAxios.patch(
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

  return request
    .catch((e) => {
      return Promise.reject(e.message || e.toString())
    })
    .then((response) => {
      response.data
    })
}
