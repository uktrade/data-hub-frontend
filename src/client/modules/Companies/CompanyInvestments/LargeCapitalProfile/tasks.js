import { apiProxyAxios } from '../../../../components/Task/utils'

export const createInvestorProfile = (companyId) =>
  apiProxyAxios.post(`v4/large-investor-profile`, companyId)

export const updateInvestorDetails = (values) => {
  const { id, investor_company_id } = values
  return apiProxyAxios.patch(
    `v4/large-investor-profile/${id}?investor_company_id=${investor_company_id}`,
    values
  )
}

export const updateInvestorRequirements = (values) => {
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
