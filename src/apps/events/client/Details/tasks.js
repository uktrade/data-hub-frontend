import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformResponseToEventCollectionDetails } from '../transformers'

export const getEventDetails = (eventId) =>
  apiProxyAxios
    .get(`/api-proxy/v3/event/${eventId}`)
    .then(({ data }) => transformResponseToEventCollectionDetails(data))
