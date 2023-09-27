import { apiProxyAxios } from '../../components/Task/utils'

export const updateOrder = (values) => {
  const useToken = values.csrfToken ? `?_csrf=${values.csrfToken}` : ''
  return apiProxyAxios.patch(`v3/omis/order/${values.id}` + useToken, values)
}
