import { apiProxyAxios } from '../../../components/Task/utils'

export const getEYBLead = (id) =>
  apiProxyAxios.get(`v4/investment-lead/eyb/${id}`).then(({ data }) => data)
