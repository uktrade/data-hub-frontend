import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'

export const getEYBLead = (id) =>
  apiProxyAxios.get(`v4/investment-lead/eyb/${id}`).then(({ data }) => data)

export const getEYBLeads = ({
  limit = 10,
  page = 1,
  company,
  country,
  sector,
  value,
}) => {
  let params = new URLSearchParams({
    limit,
    offset: limit * (parseInt(page, 10) - 1) || 0,
    ...(company ? { company } : null),
  })
  if (country)
    country.forEach((countryId) => params.append('country', countryId))
  if (sector) sector.forEach((sectorId) => params.append('sector', sectorId))
  if (value) value.forEach((valueOfLead) => params.append('value', valueOfLead))
  return apiProxyAxios
    .get(`v4/investment-lead/eyb?${params.toString()}`)
    .then(({ data }) => ({
      count: data.count,
      results: data.results,
    }))
}

export const loadEYBLeadFilterOptions = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
  ]).then(([countries, sectors]) => ({ countries, sectors }))