import { ID as COMPANY_DETAILS_ID } from '../../Companies/CompanyDetails/state'

export const ID = 'exportPipelineDetails'

export const state2props = ({ ...state }) => ({
  ...state[ID],
  company: { ...state[COMPANY_DETAILS_ID] },
})
