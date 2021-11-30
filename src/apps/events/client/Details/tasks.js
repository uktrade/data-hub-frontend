import { apiProxyAxios } from '../../../../client/components/Task/utils'
import { transformResponseToEventDetails } from '../../../../client/modules/Events/transformers'

export const getEventDetails = (eventId) =>
  apiProxyAxios
    .get(`/api-proxy/v3/event/${eventId}`)
    .then(({ data }) => transformResponseToEventDetails(data))
