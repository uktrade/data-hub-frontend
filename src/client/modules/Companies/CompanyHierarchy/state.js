import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'

export const state2props = (state) => {
  const company = state[COMPANY_DETAILS_ID].company
  return { company }
}
