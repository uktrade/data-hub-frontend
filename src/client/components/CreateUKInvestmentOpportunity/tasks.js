import { apiProxyAxios } from '../Task/utils'

export default (name) =>
  apiProxyAxios
    .post('v4/large-capital-opportunity', { name })
    .then(({ data: { id } }) => id)
