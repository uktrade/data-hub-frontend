import { transformResponseToCollection } from './transformers'
import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../metadata'
import { apiProxyAxios } from '../../../components/Task/utils'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getContacts = ({
  page,
  name,
  limit = 10,
  sortby,
  archived,
  companyId,
  company_name,
  address_country,
  company_uk_region,
  company_sector_descends,
}) =>
  apiProxyAxios
    .post('/v3/search/contact', {
      name,
      limit,
      sortby,
      archived,
      company: companyId,
      company_name,
      address_country,
      company_uk_region,
      company_sector_descends,
      offset: limit * (page - 1),
    })
    .then(
      ({ data }) => transformResponseToCollection(companyId, data),
      handleError
    )

export const getContactsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
  ])
    .then(([sectorOptions, countryOptions, ukRegionOptions]) => ({
      sectorOptions,
      countryOptions,
      ukRegionOptions,
    }))
    .catch(handleError)
