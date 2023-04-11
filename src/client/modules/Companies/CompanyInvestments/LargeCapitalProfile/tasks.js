import { apiProxyAxios } from '../../../../components/Task/utils'

export const updateInvestorDetails = (values) => {
  const { id, investor_company_id } = values
  return apiProxyAxios.patch(
    `v4/large-investor-profile/${id}?investor_company_id=${investor_company_id}`,
    values
  )
}

export const updateInvestorLocation = (values) => {
  const { id, investor_company_id } = values
  return apiProxyAxios.patch(
    `v4/large-investor-profile/${id}?investor_company_id=${investor_company_id}`,
    values
  )
}
