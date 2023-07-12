import { apiProxyAxios } from '../../../components/Task/utils'

export const updateInvestmentProject = (values) =>
  apiProxyAxios.patch(`v3/investment/${values.id}`, values)
