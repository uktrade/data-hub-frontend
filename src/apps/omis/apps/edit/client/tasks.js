import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import {
  transformAdvisersForAPI,
  transformSubscribersForAPI,
} from './transformers'

export function saveOrderAssignees({ values, id, canRemoveAssignees }) {
  const url = canRemoveAssignees
    ? `/v3/omis/order/${id}/assignee?force-delete=1`
    : `/v3/omis/order/${id}/assignee`
  return apiProxyAxios.patch(url, transformAdvisersForAPI(values))
}

export function saveOrderSubscribers({ values, id, canRemoveSubscribers }) {
  const url = canRemoveSubscribers
    ? `/v3/omis/order/${id}/subscriber-list?force-delete=1`
    : `/v3/omis/order/${id}/subscriber-list`
  return apiProxyAxios.put(url, transformSubscribersForAPI(values))
}
