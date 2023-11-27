import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({ adviser, sortby = 'due_date:asc' }) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 50,
      offset: 0,
      created_by: adviser.id,
      adviser: [adviser.id],
      sortby,
    })
    .then(({ data }) => data)
