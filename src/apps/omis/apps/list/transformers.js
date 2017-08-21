const { get } = require('lodash')

function transformOrderToListItem ({
  id,
  reference,
  company,
  contact,
  primary_market,
  delivery_date,
}) {
  return {
    id,
    type: 'order',
    url: 'omis/',
    name: `${get(company, 'name')} / ${get(contact, 'name')} - ${reference}`,
    meta: [
      {
        label: 'Company',
        value: get(company, 'name'),
      },
      {
        label: 'Market',
        value: get(primary_market, 'name'),
      },
      {
        label: 'Contact',
        value: get(contact, 'name'),
      },
      {
        label: 'Delivery date',
        value: delivery_date,
      },
    ],
  }
}

module.exports = {
  transformOrderToListItem,
}
