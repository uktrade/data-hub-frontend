import { apiProxyAxios } from '../../../components/Task/utils'

export const getTaskDetail = (id) =>
  apiProxyAxios.get(`v4/task/${id}`).then(({ data }) => data)

export const saveTaskStatusComplete = ({ taskId }) =>
  apiProxyAxios.post(`/v4/task/${taskId}/status-complete`)

export const saveTaskStatusActive = ({ taskId }) =>
  apiProxyAxios.post(`/v4/task/${taskId}/status-active`)

export const deleteTask = ({ taskId }) =>
  apiProxyAxios.post(`/v4/task/${taskId}/archive`, { reason: 'deleted' })
