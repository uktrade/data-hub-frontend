import { apiProxyAxios } from '../../../components/Task/utils'

export const createFile = (values) => apiProxyAxios.post('v4/document/', values)
