import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestmentProjectTask = ({ investmentProjectTask }) =>
  apiProxyAxios.post(`v4/investmentprojecttask/`, investmentProjectTask)
