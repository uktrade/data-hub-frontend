import { apiProxyAxios } from '../../../../components/Task/utils'
import { getPageOffset } from '../../../../utils/pagination'
import { transformResponseToSubsidiaryCollection } from './transformers'

export const getSubsidiaryCollection = ({
  limit = 10,
  page,
  name,
  sector_descends,
  country,
  uk_postcode,
  uk_region,
  us_state = [],
  canadian_province = [],
  company_number,
  headquarter_type,
  sortby = 'modified_on:desc',
  parentCompanyId,
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset: getPageOffset({ limit, page }),
      headquarter_type,
      global_headquarters: null,
      is_global_ultimate: false,
      name,
      sector_descends,
      country,
      uk_postcode,
      uk_region,
      area: administrativeAreas.length ? administrativeAreas : undefined,
      archived: false,
      company_number,
      sortby,
    })
    .then(({ data }) =>
      transformResponseToSubsidiaryCollection(parentCompanyId, data)
    )
}
