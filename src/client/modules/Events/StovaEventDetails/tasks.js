import { apiProxyAxios } from '../../../components/Task/utils'
import { transformResponeToStovaEventDetails } from './transformers'

export const getStovaEventDetails = (stovaEventId) => {
  apiProxyAxios
    .get(`/v4/company-activity/stova-events/${stovaEventId}`)
    .then(({ data }) => transformResponeToStovaEventDetails(data))
}
