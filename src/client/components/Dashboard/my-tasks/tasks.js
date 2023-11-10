import { apiProxyAxios } from '../../Task/utils'
import { transformMyTasksToListItem } from './transformers'

export const getMyTasks = ({ currentAdviserId }) =>
  apiProxyAxios
    .post('/v4/search/tasks', {
      limit: 10,
      offset: 0,
      created_by: currentAdviserId,
      adviser: [currentAdviserId],
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results.map(transformMyTasksToListItem),
    }))
