import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../utils/date'

export const ID = 'myInvestmentProjects'
export const TASK_GET_MY_INVESTMENTS_LIST = 'TASK_GET_MY_INVESTMENTS_LIST'

export const state2props = (state) => {
  const financialYearStart = getFinancialYearStart(new Date())
  return {
    ...state[ID],
    landDateOptions: [
      {
        name: 'Show all',
        id: 'all-land-dates',
      },
      {
        name: `Current year ${generateFinancialYearLabel(financialYearStart)}`,
        id: `${financialYearStart}`,
      },
      {
        name: `Last year ${generateFinancialYearLabel(financialYearStart - 1)}`,
        id: `${financialYearStart - 1}`,
      },
      {
        name: `Next year ${generateFinancialYearLabel(financialYearStart + 1)}`,
        id: `${financialYearStart + 1}`,
      },
    ],
  }
}
