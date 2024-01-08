import { apiProxyAxios } from '../../../../components/Task/utils'
import { getPageOffset } from '../../../../utils/pagination'
import { transformResponseToGlobalHQCollection } from './transformers'

export const getGlobalHeadquartersCollection = ({
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
  sortby = 'modified_on:desc',
  childCompanyId,
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset: getPageOffset({ limit, page }),
      headquarter_type: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
      name,
      sector_descends,
      country,
      uk_postcode,
      uk_region,
      area: administrativeAreas.length ? administrativeAreas : undefined,
      archived: false,
      company_number,
      is_global_ultimate: false,
      sortby,
    })
    .then(({ data }) =>
      transformResponseToGlobalHQCollection(childCompanyId, data)
    )
}

export const setGlobalHq = (values) =>
  apiProxyAxios.patch(`/v4/company/${values.companyId}`, {
    global_headquarters: values.globalHqId,
  })

export const removeGlobalHq = (values) =>
  apiProxyAxios.patch(`/v4/company/${values.companyId}`, {
    global_headquarters: null,
  })
