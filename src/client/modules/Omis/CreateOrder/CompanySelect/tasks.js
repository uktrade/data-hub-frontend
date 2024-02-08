import { apiProxyAxios } from '../../../../components/Task/utils'
import { getPageOffset } from '../../../../utils/pagination'
import { transformResponseToCompanyCollection } from './transformers'

export const getOmisCompanies = ({
  limit = 10,
  page,
  headquarter_type,
  name,
  sector_descends = [], // Default to empty array if not provided
  sub_sector_descends = [], // Default to empty array if not provided
  country,
  uk_postcode,
  uk_region,
  us_state = [],
  canadian_province = [],
  sortby = 'modified_on:desc',
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset: getPageOffset({ limit, page }),
      headquarter_type,
      name,
      sector_descends: [...sector_descends, ...sub_sector_descends],
      country,
      uk_postcode,
      uk_region,
      area: administrativeAreas.length ? administrativeAreas : undefined,
      archived: false,
      sortby,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data))
}
