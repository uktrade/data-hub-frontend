import axios from 'axios'

import { getMetadataOptions } from '../../../metadata'
import { transformResponseToCollection } from './transformers'
import { getPageOffset } from '../../../utils/pagination'
import { metadata } from '../../../../lib/urls'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getOrders = ({
  page,
  limit = 10,
  status,
  sortby,
  uk_region,
  reference,
  companyId,
  company_name,
  contact_name,
  primary_market,
  sector_descends,
  completed_on_after,
  completed_on_before,
  delivery_date_after,
  delivery_date_before,
}) =>
  axios
    .post('/api-proxy/v3/search/order', {
      limit,
      offset: getPageOffset({ limit, page }),
      status,
      sortby,
      uk_region,
      reference,
      company: companyId,
      company_name,
      contact_name,
      primary_market,
      sector_descends,
      completed_on_after,
      completed_on_before,
      delivery_date_after,
      delivery_date_before,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

export const getOrdersMetadata = () =>
  Promise.all([
    getMetadataOptions(metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
    getMetadataOptions(metadata.omisMarket()),
    getMetadataOptions(metadata.ukRegion()),
  ])
    .then(([sectorOptions, omisMarketOptions, ukRegionOptions]) => ({
      sectorOptions,
      omisMarketOptions,
      ukRegionOptions,
    }))
    .catch(handleError)
