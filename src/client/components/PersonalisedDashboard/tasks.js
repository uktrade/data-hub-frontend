import { apiProxyAxios } from '../Task/utils'

export const fetchOutstandingPropositions = ({ adviser }) =>
  apiProxyAxios
    .get('/v4/proposition', {
      params: {
        adviser_id: adviser.id,
        status: 'ongoing',
        sortBy: 'deadline',
        limit: 5,
      },
    })
    .then(({ data }) => data)
