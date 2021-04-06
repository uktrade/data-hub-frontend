import { apiProxyAxios } from '../Task/utils'

export const fetchOutstandingPropositions = ({ adviser }) =>
  apiProxyAxios
    .get('/v4/proposition', {
      params: {
        adviser_id: adviser.id,
        status: 'ongoing',
        sortby: 'deadline',
        limit: 3,
      },
    })
    .then(({ data }) => data)
