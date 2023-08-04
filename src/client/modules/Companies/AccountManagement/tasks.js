import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ values, companyId }) => {
  if (values.has_blocker == 'yes') {
    values.has_blocker = true
  } else {
    values.has_blocker = false
  }
  values.progress = parseInt(values.progress)
  values.target_date = `${values.target_date.year}-${values.target_date.month}-${values.target_date.day}`
  values.company = companyId
  const request = apiProxyAxios.post
  const endpoint = `/v4/company/${companyId}/objective`
  return request(endpoint, values)
}
