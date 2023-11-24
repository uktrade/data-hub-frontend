import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({ adviser }) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 10,
      offset: 0,
      created_by: adviser.id,
      adviser: [adviser.id],
    })
    .then(({ data }) => data)
