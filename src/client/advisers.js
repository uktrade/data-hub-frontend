import { castArray } from 'lodash'

import { apiProxyAxios } from './components/Task/utils'

export const getAdviserNames = (adviser) => {
  if (!adviser) {
    return []
  }

  const advisers = castArray(adviser)

  return apiProxyAxios
    .post('/v4/search/adviser', { id: advisers })
    .then(({ data }) => data.results)
}
