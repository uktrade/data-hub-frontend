import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getLargeCapitalProfiles({ limit = 10, page, countryOfOrigin }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0
  return apiProxyAxios
    .post('/v4/search/large-investor-profile', {
      limit,
      offset,
      country_of_origin: countryOfOrigin,
    })
    .then(({ data }) => {
      return data
    })
}

export const loadFilterOptions = () =>
  apiProxyAxios.get('/v4/metadata/country').then(({ data }) => ({
    countries: data.map(({ id, name }) => ({ value: id, label: name })),
  }))
