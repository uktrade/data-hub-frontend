import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({ adviserId }) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 10,
      offset: 0,
      created_by: [adviserId],
      adviser: [adviserId],
    })
    .then(({ data }) => data.count)
