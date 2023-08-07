import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformValueForAPI } from '../../../utils/date'
import { transformRadioOptionToBool } from '../../Investments/Projects/transformers'

export const saveStrategy = ({ strategy, companyId }) => {
  const request = apiProxyAxios.patch
  const endpoint = `/v4/company/${companyId}`
  return request(endpoint, { strategy: strategy })
}

export const saveObjective = ({ values, companyId }) => {
  values.target_date = transformValueForAPI(values.target_date)
  values.progress = parseInt(values.progress)
  values.company = companyId
  values.has_blocker = transformRadioOptionToBool(values.has_blocker)
  const request = apiProxyAxios.post
  const endpoint = `/v4/company/${companyId}/objective`
  return request(endpoint, values)
}
