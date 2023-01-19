import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import {
  getHeadquarterTypeOptions,
  getMetadataOptions,
} from '../../../metadata'
import { getPageOffset } from '../../../utils/pagination'

import { transformResponseToCompanyCollection } from './transformers'

const usa = '81756b9a-5d95-e211-a939-e4115bead28a'
const canada = '5daf72a6-5d95-e211-a939-e4115bead28a'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getCompanies = ({
  limit = 10,
  page,
  headquarter_type,
  name,
  sector_descends,
  country,
  uk_postcode,
  uk_region,
  us_state = [],
  canadian_province = [],
  archived,
  export_to_countries,
  future_interest_countries,
  latest_interaction_date_before,
  latest_interaction_date_after,
  one_list_group_global_account_manager,
  export_segment,
  export_sub_segment,
  sortby = 'modified_on:desc',
}) => {
  const administrativeAreas = [...us_state, ...canadian_province]
  return apiProxyAxios
    .post('/v4/search/company', {
      limit,
      offset: getPageOffset({ limit, page }),
      headquarter_type,
      name,
      sector_descends,
      country,
      uk_postcode,
      uk_region,
      area: administrativeAreas.length ? administrativeAreas : undefined,
      archived,
      export_to_countries,
      future_interest_countries,
      latest_interaction_date_before,
      latest_interaction_date_after,
      one_list_group_global_account_manager,
      export_segment,
      export_sub_segment,
      sortby,
    })
    .then(({ data }) => transformResponseToCompanyCollection(data))
}

/**
 * Get the options for each of the metadata urls.
 *
 * Waits until all urls have been fetched before generating a result.
 *
 * @returns {promise} - the promise containing a list of options for each category
 */
const getCompaniesMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getHeadquarterTypeOptions(urls.metadata.headquarterType()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
    getMetadataOptions(urls.metadata.administrativeArea(), {
      params: { country: usa },
    }),
    getMetadataOptions(urls.metadata.administrativeArea(), {
      params: { country: canada },
    }),
    getMetadataOptions(urls.metadata.country()),
  ])
    .then(
      ([
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        usStateOptions,
        canadianProvinceOptions,
        countryOptions,
      ]) => ({
        sectorOptions,
        headquarterTypeOptions,
        ukRegionOptions,
        usStateOptions,
        canadianProvinceOptions,
        countryOptions,
      })
    )
    .catch(handleError)

export { getCompanies, getCompaniesMetadata }
