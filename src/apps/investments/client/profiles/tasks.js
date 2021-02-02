import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getLargeCapitalProfiles({ limit = 10, page, countries }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0
  return apiProxyAxios
    .post('/v4/search/large-investor-profile', {
      params: {
        limit,
        offset,
        country_of_origin: countries,
      },
    })
    .then(({ data }) => {
      return data
    })
}

export const loadFilterOptions = () =>
  apiProxyAxios.get('/v4/metadata/country').then(({ data }) => ({
    countries: data.map(({ id, name }) => ({ value: id, label: name })),
  }))
