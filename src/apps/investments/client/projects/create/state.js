export const TASK_SEARCH_COMPANY = 'TASK_SEARCH_COMPANY'

export const CREATE_INVESTMENT_PROJECT_ID = 'createInvestmentProject'
export const state2props = (state) => state[CREATE_INVESTMENT_PROJECT_ID]

export const TASK_GET_COMPANY_INVESTMENT_COUNT =
  'TASK_GET_COMPANY_INVESTMENT_COUNT'
export const COMPANY_INVESTMENT_COUNT_ID = 'companyInvestmentCount'
export const companyInvestmentCountState2props = (state) => {
  return state[COMPANY_INVESTMENT_COUNT_ID]
}

export const TASK_CREATE_INVESTMENT_PROJECT = 'TASK_CREATE_INVESTMENT_PROJECT'
export const TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES =
  'TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES'

export const CREATE_INVESTMENT_OPEN_CONTACT_FORM_ID = 'openContactForm'
