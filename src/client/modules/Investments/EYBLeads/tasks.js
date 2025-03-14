import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'

export const getEYBLead = (id) =>
  apiProxyAxios.get(`v4/investment-lead/eyb/${id}`).then(({ data }) => data)

export const getEYBLeads = ({
  limit = 10,
  page = 1,
  company,
  overseas_region = [],
  country = [],
  sector = [],
  value = [],
  sortby,
}) => {
  let params = new URLSearchParams({
    limit,
    offset: limit * (parseInt(page, 10) - 1) || 0,
    ...(company ? { company } : null),
    sortby: sortby ? sortby : '-triage_created',
  })
  overseas_region.forEach((overseasRegionId) =>
    params.append('overseas_region', overseasRegionId)
  )
  country.forEach((countryId) => params.append('country', countryId))
  sector.forEach((sectorId) => params.append('sector', sectorId))
  value.forEach((valueOfLead) => params.append('value', valueOfLead))
  return apiProxyAxios
    .get(`v4/investment-lead/eyb?${params.toString()}`)
    .then(({ data }) => ({
      count: data.count,
      results: data.results,
    }))
}

export const loadEYBLeadFilterOptions = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.overseasRegion()),
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
  ]).then(([overseasRegions, countries, sectors]) => ({
    overseasRegions,
    countries,
    sectors,
  }))
