import { apiProxyAxios } from '../../../components/Task/utils'
import { transformTaskFormValuesForAPI } from './transformers'

export const saveTaskDetail = ({ values, currentAdviserId, taskId }) => {
  const request = taskId ? apiProxyAxios.patch : apiProxyAxios.post
  const endpoint = taskId ? `/v4/task/${taskId}` : '/v4/task'
  return request(
    endpoint,
    transformTaskFormValuesForAPI(values, currentAdviserId)
  )
}
