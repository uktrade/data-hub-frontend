import urls from '../lib/urls'
import { apiProxyAxios } from './components/Task/utils'

export const getTeamNames = (team) => {
  if (!team) {
    return []
  }

  const teams = Array.isArray(team) ? team : [team]

  return apiProxyAxios
    .all(
      teams.map((teamId) =>
        apiProxyAxios.get(`${urls.metadata.team()}?id=${teamId}`)
      )
    )
    .then(
      apiProxyAxios.spread((...responses) =>
        responses.map(({ data }) => ({
          teams: data[0],
        }))
      )
    )
}
