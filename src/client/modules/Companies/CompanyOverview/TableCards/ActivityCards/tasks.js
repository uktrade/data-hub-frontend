import { apiProxyAxios } from '../../../../../components/Task/utils'
import { transformResponseToCollection } from './transformers'

export const getCompanyOverviewActivities = ({
  limit,
  company,
  date_before,
  date_after,
  sortby = 'date:desc',
}) =>
  apiProxyAxios
    .post('/v3/search/interaction', {
      limit,
      company,
      sortby,
      date_before,
      date_after,
    })
    .then(({ data }) => transformResponseToCollection(data))
