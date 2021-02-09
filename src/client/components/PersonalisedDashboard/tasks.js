import { apiProxyAxios } from '../Task/utils'

export const getUserDetails = ({ adviser }) => {
  return apiProxyAxios
    .get('/whoami/', {
      adviser: [adviser],
    })
    .then(({ data }) => data.results)
}
