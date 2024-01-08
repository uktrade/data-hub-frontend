import { apiProxyAxios } from '../../../components/Task/utils'
import { METHOD_PATCH, METHOD_POST } from '../../../../common/constants'

export const archiveInteraction = ({ interactionId, values }) => {
  const isRescheduled = values.archived_reason == 'rescheduled'

  const endpoint = isRescheduled
    ? `/v4/interaction/${interactionId}`
    : `/v4/interaction/${interactionId}/archive`

  const data = isRescheduled
    ? { date: values.date }
    : { reason: values.archived_reason }

  const method = isRescheduled ? METHOD_PATCH : METHOD_POST
  const options = {
    data: data,
    url: endpoint,
    method: method,
  }
  return apiProxyAxios(options)
}

export const getInteraction = (id) =>
  apiProxyAxios.get(`v4/interaction/${id}`).then(({ data }) => data)
