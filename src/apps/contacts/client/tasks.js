import axios from 'axios'

import { transformResponseToCollection } from './transformers'
import urls from '../../../lib/urls'
import { getMetadataOptions } from '../../../client/metadata'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getContacts = ({
  page,
  name,
  limit = 10,
  sortby,
  archived,
  company_name,
  address_country,
  company_uk_region,
  company_sector_descends,
}) =>
  axios
    .post('/api-proxy/v3/search/contact', {
      name,
      limit,
      sortby,
      archived,
      company_name,
      address_country,
      company_uk_region,
      company_sector_descends,
      offset: limit * (page - 1),
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

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
