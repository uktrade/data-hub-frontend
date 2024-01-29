import { apiProxyAxios } from '../../Task/utils'

export const getMyTasks = ({
  adviser,
  created_by,
  not_created_by,
  advisers,
  not_advisers,
  archived,
  sortby = 'due_date:asc',
  company,
  project,
  status,
}) =>
  apiProxyAxios
    .post('/v4/search/task', {
      limit: 50,
      offset: 0,
      created_by,
      not_created_by,
      advisers,
      not_advisers,
      adviser,
      archived,
      sortby,
      company,
      investment_project: project,
      status,
    })
    .then(({ data }) => data)
