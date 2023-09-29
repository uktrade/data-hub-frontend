import axios from 'axios'
import { castArray } from 'lodash'

import urls from '../lib/urls'
import { apiProxyAxios } from './components/Task/utils'

export const getTeamNames = (team) => {
  if (!team) {
    return []
  }

  const teams = castArray(team)

  return axios
    .all(
      teams.map((teamId) =>
        apiProxyAxios.get(`${urls.metadata.team()}?id=${teamId}`)
      )
    )
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          teams: data[0],
        }))
      )
    )
}
