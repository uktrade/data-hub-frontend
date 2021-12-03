import { apiProxyAxios } from '../../../components/Task/utils'
import { transformResponseToEventDetails } from '../transformers'

export const getEventSummaryDetails = (eventId) =>
  apiProxyAxios
    .get(`/api-proxy/v3/event/${eventId}`)
    .then(({ data }) => transformResponseToEventDetails(data))
