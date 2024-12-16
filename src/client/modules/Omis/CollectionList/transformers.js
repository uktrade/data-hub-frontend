import { find } from 'lodash'

import { STATUSES } from './constants'
import { omis } from '../../../../lib/urls'
import { currencyGBP } from '../../../utils/number-utils'

const {
  formatDate,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../utils/date-utils')

export const transformOrderCost = (cost) => (cost ? cost * 100 : undefined)

export const transformOrderToListItem = ({
  id,
  status,
  sector,
  contact,
  company,
  uk_region,
  reference,
  created_on,
  modified_on,
  delivery_date,
  primary_market,
} = {}) => {
  const orderState = find(STATUSES, { value: status })

  const metadata = [
    {
      label: 'Company',
      value: company?.name,
    },
    {
      label: 'Created',
      value: created_on && formatDate(created_on, DATE_FORMAT_MEDIUM_WITH_TIME),
    },
    {
      label: 'Contact',
      value: contact?.name,
    },
    {
      label: 'UK region',
      value: uk_region?.name,
    },
    {
      label: 'Sector',
      value: sector?.name,
    },
    {
      label: 'Delivery date',
      value: delivery_date
        ? formatDate(delivery_date, DATE_FORMAT_COMPACT)
        : null,
    },
  ].filter((item) => item.value)

  const badges = [
    { text: orderState?.label },
    { text: primary_market?.name },
  ].filter((item) => item.text)

  const retVal = {
    id,
    badges,
    metadata,
    headingText: reference,
    headingUrl: omis.workOrder(id),
    subheading:
      modified_on &&
      `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`,
  }

  return retVal
}

export const transformOrderToReconciliationListItem = ({
  id,
  status,
  company,
  modified_on,
  payment_due_date,
  reference,
  subtotal_cost,
  total_cost,
} = {}) => {
  const getCostAsDecimal = (cost) => cost / 100
  const orderState = find(STATUSES, { value: status })
  const metadata = [
    {
      label: 'Payment due date',
      value:
        payment_due_date && formatDate(payment_due_date, DATE_FORMAT_MEDIUM),
    },
    {
      label: 'Company name',
      value: company?.name,
    },
    {
      label: 'Amount (ex. VAT)',
      value: currencyGBP(getCostAsDecimal(subtotal_cost)),
    },
    {
      label: 'Amount (inc. VAT)',
      value: currencyGBP(getCostAsDecimal(total_cost)),
    },
  ].filter((item) => item.value)

  const badges = [{ text: orderState?.label }].filter((item) => item.text)

  const retVal = {
    id,
    badges,
    metadata,
    headingText: reference,
    headingUrl: omis.paymentReconciliation(id),
    subheading:
      modified_on &&
      `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`,
  }

  return retVal
}

const transformResponse =
  (transformItem) =>
  ({ count, results = [], summary }) => ({
    count,
    summary,
    results: results.map(transformItem),
  })

export const transformResponseToCollection = transformResponse(
  transformOrderToListItem
)
export const transformResponseToReconciliationCollection = transformResponse(
  transformOrderToReconciliationListItem
)
