import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'

export const TASK_SAVE_EXPORT = 'TASK_SAVE_EXPORT'

export const state2props = ({ ...state }) => ({
  company: { ...state[COMPANY_DETAILS_ID] },
})
