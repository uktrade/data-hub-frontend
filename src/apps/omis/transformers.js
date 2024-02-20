const { find, get } = require('lodash')

const { ORDER_STATES } = require('./constants')

function transformOrderToListItem({
  id,
  reference,
  status,
  company,
  contact,
  primary_market,
  uk_region,
  delivery_date,
  modified_on,
  created_on,
  sector,
} = {}) {
  if (!id || !reference) {
    return
  }

  const orderState = find(ORDER_STATES, { value: status })

  const item = {
    id,
    type: 'order',
    urlPrefix: 'omis/',
    name: reference,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    meta: [
      {
        label: 'Status',
        type: 'badge',
        value: get(orderState, 'label'),
      },
      {
        label: 'Market',
        type: 'badge',
        value: get(primary_market, 'name'),
      },
      {
        label: 'Company',
        value: get(company, 'name'),
      },
      {
        label: 'Created',
        type: 'datetime',
        value: created_on,
      },
      {
        label: 'Contact',
        value: get(contact, 'name'),
      },
      {
        label: 'UK region',
        value: uk_region,
      },
      {
        label: 'Sector',
        value: sector,
      },
    ],
  }

  if (delivery_date) {
    item.meta.push({
      label: 'Delivery date',
      type: 'date',
      value: delivery_date,
    })
  }

  return item
}

module.exports = {
  transformOrderToListItem,
}
