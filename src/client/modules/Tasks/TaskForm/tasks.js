import { apiProxyAxios } from '../../../components/Task/utils'
import { transformTaskFormValuesForAPI } from './transformers'

export const saveTaskDetail = ({ values, currentAdviserId, taskId }) =>
  apiProxyAxios.patch(
    `/v4/task/${taskId}`,
    transformTaskFormValuesForAPI(values, currentAdviserId)
  )
