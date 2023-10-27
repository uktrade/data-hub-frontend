import { apiProxyAxios } from '../../components/Task/utils'

export const updateOrder = (values) => {
  const useToken = values.csrfToken ? `?_csrf=${values.csrfToken}` : ''
  return apiProxyAxios.patch(`v3/omis/order/${values.id}${useToken}`, values)
}

export const savePayment = (values) =>
  apiProxyAxios.post(`v3/omis/order/${values.id}/payment`, values.payment)

export const cancelOrder = (values) =>
  apiProxyAxios.post(`v3/omis/order/${values.id}/cancel`, values)
