import axios from 'axios'

import { apiProxyAxios } from './components/Task/utils'
import { castArray } from 'lodash'

export const getAdviserNames = (adviser) => {
  if (!adviser) {
    return []
  }

  const advisers = castArray(adviser)

  return axios
    .all(advisers.map((adviser) => apiProxyAxios.get(`/adviser/${adviser}/`)))
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          advisers: data,
        }))
      )
    )
}
