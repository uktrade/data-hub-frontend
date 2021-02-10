import { apiProxyAxios } from '../../../../client/components/Task/utils'

export const getUserDetails = ({ adviser }) => {
  return apiProxyAxios
    .get('/whoami/', {
      adviser: [adviser],
    })
    .then(({ data }) => data.results)
}
