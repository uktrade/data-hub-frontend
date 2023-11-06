import { apiProxyAxios } from '../../components/Task/utils'
import {
  transformAdvisersForAPI,
  transformSubscribersForAPI,
} from './transformers'

export const updateOrder = (values) => {
  const useToken = values.csrfToken ? `?_csrf=${values.csrfToken}` : ''
  return apiProxyAxios.patch(`v3/omis/order/${values.id}${useToken}`, values)
}

export const savePayment = (values) =>
  apiProxyAxios.post(`v3/omis/order/${values.id}/payment`, values.payment)

export const cancelOrder = (values) =>
  apiProxyAxios.post(`v3/omis/order/${values.id}/cancel`, values)

export const updateAssignees = (values) =>
  apiProxyAxios.patch(`v3/omis/order/${values.id}/assignee`, values.assignees)

export const completeOrder = (values) =>
  apiProxyAxios.patch(
    `v3/omis/order/${values.id}/assignee`,
    values.assignees
  ) && apiProxyAxios.post(`v3/omis/order/${values.id}/complete`)

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
