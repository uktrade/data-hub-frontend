import { apiProxyAxios } from '../../../components/Task/utils'
import { transformResponseToEventDetails } from '../transformers'

export const getEventDetails = (eventId) =>
  apiProxyAxios
    .get(`/v4/event/${eventId}`)
    .then(({ data }) => transformResponseToEventDetails(data))
