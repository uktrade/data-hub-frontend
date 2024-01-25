export const TASK_GET_LISTS_COMPANY_IS_IN = 'TASK_GET_LISTS_COMPANY_IS_IN'
export const ID = 'companyListsCompanyIn'
export const state2props = (state) => state[ID]

export const companyState2Props = (state) => ({
  csrfToken: state.csrfToken,
})
