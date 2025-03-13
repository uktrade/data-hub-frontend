import {
  transformAdviserData,
  transformOneListTiers,
  transformTeamMembers,
} from './transformers'

export const ID = 'oneListDetails'

export const TASK_SAVE_ONE_LIST_DETAILS = 'TASK_SAVE_ONE_LIST_DETAILS'
export const TASK_GET_ONE_LIST_DETAILS = 'TASK_GET_ONE_LIST_DETAILS'

export const state2props = (state) => {
  return {
    ...state[ID],
    globalAccountManager: transformAdviserData(
      state[ID]?.company?.one_list_group_global_account_manager
    ),
    oneListTiers: transformOneListTiers(state[ID].oneListTiers),
    oneListTeam: transformTeamMembers(state[ID].oneListTeam),
    userPermissions: state.userPermissions,
  }
}
