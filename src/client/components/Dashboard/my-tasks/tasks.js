import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({ adviser, created_by, sortby = 'due_date:asc' }) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 50,
      offset: 0,
      created_by: created_by,
      adviser: adviser,
      sortby,
    })
    .then(({ data }) => data)