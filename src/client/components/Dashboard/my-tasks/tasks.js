import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({
  adviser,
  created_by,
  not_created_by,
  advisers,
  not_advisers,
  sortby = 'due_date:asc',
}) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 50,
      offset: 0,
      created_by: created_by,
      not_created_by: not_created_by,
      advisers: advisers,
      not_advisers: not_advisers,
      adviser: adviser,
      sortby,
    })
    .then(({ data }) => data)
