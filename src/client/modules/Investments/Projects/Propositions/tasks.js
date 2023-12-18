import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestmentProposition = (values) =>
  apiProxyAxios.post(
    `v3/investment/${values.investment_project}/proposition`,
    values
  )

export const abandonInvestmentProposition = (values) =>
  apiProxyAxios.post(
    `v3/investment/${values.projectId}/proposition/${values.propositionId}/abandon`,
    values
  )
