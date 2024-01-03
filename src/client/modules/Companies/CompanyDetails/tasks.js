import { apiProxyAxios } from '../../../components/Task/utils'

export const getCompanyDetails = (companyId) =>
  apiProxyAxios.get(`/v4/company/${companyId}`).then(({ data }) => data)
