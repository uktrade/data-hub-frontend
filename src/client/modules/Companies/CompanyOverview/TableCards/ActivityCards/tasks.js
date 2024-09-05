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
    .post(
      `/v4/company/${company}/activity`,
      {
        company,
        sortby,
        date_before,
        date_after,
      },
      { params: { limit: limit } }
    )
    .then(({ data }) => transformResponseToCollection(data))
