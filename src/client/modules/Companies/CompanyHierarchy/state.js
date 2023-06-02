import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'

export const ID = 'companyHierarchy'

export const TASK_GET_DNB_FAMILY_TREE = 'TASK_GET_DNB_FAMILY_TREE'

export const state2props = (state) => {
  const company = state[COMPANY_DETAILS_ID].company
  const familyTree = state[ID].familyTree
  return { company, familyTree }
}
