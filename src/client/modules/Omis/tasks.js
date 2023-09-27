import { apiProxyAxios } from '../../components/Task/utils'

export const updateOrder = (values) =>
  apiProxyAxios.patch(
    `v3/omis/order/${values.id}?_csrf=${values.csrfToken}`,
    values
  )
