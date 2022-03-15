import axios from 'axios'

import { apiProxyAxios } from './components/Task/utils'

export const getAdviserNames = (adviser) => {
  if (!adviser) {
    return []
  }

  const advisers = Array.isArray(adviser) ? adviser : [adviser]

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
