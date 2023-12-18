import { apiProxyAxios } from '../../../../components/Task/utils'
import { getPageOffset } from '../../../../utils/pagination'
import { transformResponseToCompanyCollection } from './transformers'

export const getOmisCompanies = ({
  limit = 10,
  page,
  headquarter_type,
  name,
  sector_descends,
  sub_sector_descends,
  country,
  uk_postcode,
  uk_region,
  us_state = [],
  canadian_province = [],
  sortby = 'modified_on:desc',
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  const getSectors = (sector_descends, sub_sector_descends) => {
    if (sector_descends && sub_sector_descends) {
      return [...sector_descends, ...sub_sector_descends]
    }
    if (sub_sector_descends) {
      return sub_sector_descends
    }
    if (sector_descends) {
      return sector_descends
    }
  }
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset: getPageOffset({ limit, page }),
      headquarter_type,
      name,
      sector_descends: getSectors(sector_descends, sub_sector_descends),
      country,
      uk_postcode,
      uk_region,
      area: administrativeAreas.length ? administrativeAreas : undefined,
      archived: false,
      sortby,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data))
}
