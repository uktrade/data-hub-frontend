import { getMetadataOptions } from '../../../metadata'
import {
  transformOrderCost,
  transformResponseToCollection,
  transformResponseToReconciliationCollection,
} from './transformers'
import { getPageOffset } from '../../../utils/pagination'
import { metadata } from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import { STATUS } from '../constants'

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
  apiProxyAxios
    .post('/v3/search/order', {
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
    .then(({ data }) => transformResponseToCollection(data))

export const getOrdersReconciliation = ({
  page,
  limit = 10,
  status,
  sortby,
  uk_region,
  reference,
  companyId,
  company_name,
  payment_due_date,
  subtotal_cost,
  total_cost,
}) => {
  const transformedTotalCost = transformOrderCost(total_cost)
  const transformedSubtotalCost = transformOrderCost(subtotal_cost)
  return apiProxyAxios
    .post('/v3/search/order', {
      limit,
      offset: getPageOffset({ limit, page }),
      status: status
        ? status
        : [
            STATUS.QUOTE_ACCEPTED,
            STATUS.PAID,
            STATUS.CANCELLED,
            STATUS.COMPLETE,
          ],
      sortby,
      uk_region,
      reference,
      company: companyId,
      company_name,
      payment_due_date,
      subtotal_cost: transformedSubtotalCost,
      total_cost: transformedTotalCost,
    })
    .then(({ data }) => transformResponseToReconciliationCollection(data))
}

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

export const getOrdersReconciliationMetadata = () =>
  Promise.all([
    getMetadataOptions(metadata.sector(), {
      params: {
        level__lte: '0',
      },
    }),
  ]).catch(handleError)
