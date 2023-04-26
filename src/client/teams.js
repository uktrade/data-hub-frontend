import axios from 'axios'
import urls from '../lib/urls'
import { apiProxyAxios } from './components/Task/utils'
import { castArray } from 'lodash'

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
