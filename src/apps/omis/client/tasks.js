import axios from 'axios'

import { getMetadataOptions, getSectorOptions } from '../../../client/metadata'
import { transformResponseToCollection } from './transformers'
import { metadata } from '../../../lib/urls'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getOrders = ({
  page,
  limit = 10,
  sortby,
  uk_region,
  company_name,
  contact_name,
  primary_market,
  sector_descends,
}) =>
  axios
    .post('/api-proxy/v3/search/order', {
      offset: limit * (page - 1),
      limit,
      sortby,
      uk_region,
      company_name,
      contact_name,
      primary_market,
      sector_descends,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

export const getOrdersMetadata = () =>
  Promise.all([
    getSectorOptions(metadata.sector()),
    getMetadataOptions(metadata.country()),
    getMetadataOptions(metadata.ukRegion()),
  ])
    .then(([sectorOptions, countryOptions, ukRegionOptions]) => ({
      sectorOptions,
      countryOptions,
      ukRegionOptions,
    }))
    .catch(handleError)
