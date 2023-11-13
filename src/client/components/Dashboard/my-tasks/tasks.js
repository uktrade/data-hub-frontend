import { apiProxyAxios } from '../../Task/utils'
import { transformMyTasksToListItem } from './transformers'

export const getMyTasks = ({ adviserId }) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 10,
      offset: 0,
      created_by: [adviserId],
      adviser: [adviserId],
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results.map(transformMyTasksToListItem),
    }))
