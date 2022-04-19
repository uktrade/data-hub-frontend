import axios from 'axios'
import urls from '../lib/urls'
import { apiProxyAxios } from './components/Task/utils'

export const getTeamNames = (team) => {
  if (!team) {
    return []
  }

  const teams = Array.isArray(team) ? team : [team]

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
