import { METHOD_POST } from '../../../../common/constants'
import { apiProxyAxios } from '../../../components/Task/utils'

export const getTaskDetail = (id) =>
  apiProxyAxios.get(`v4/task/${id}`).then(({ data }) => data)

export const archiveTask = ({ taskId }) => {
  const endpoint = `/v4/task/${taskId}/archive`

  const data = { reason: 'completed' }

  const options = {
    data: data,
    url: endpoint,
    method: METHOD_POST,
  }
  return apiProxyAxios(options)
}
