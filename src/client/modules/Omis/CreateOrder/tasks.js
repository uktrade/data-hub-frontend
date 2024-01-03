import { apiProxyAxios } from '../../../components/Task/utils'

export const createOrder = (values) =>
  apiProxyAxios.post('v3/omis/order', values)
