/* eslint-disable camelcase */
const { get } = require('lodash')
const Case = require('case')

function transformOrderToListItem ({
  id,
  reference,
  status,
  company,
  contact,
  primary_market,
  delivery_date,
  modified_on,
} = {}) {
  if (!id || !reference) { return }

  const item = {
    id,
    type: 'order',
    urlPrefix: 'omis/',
    name: reference,
    meta: [
      {
        label: 'Status',
        type: 'badge',
        value: Case.sentence(status),
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
        label: 'Updated',
        type: 'datetime',
        value: modified_on,
      },
      {
        label: 'Contact',
        value: get(contact, 'name'),
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
