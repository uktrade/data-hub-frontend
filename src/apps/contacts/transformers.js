/* eslint-disable camelcase */
const { get } = require('lodash')

function transformContactToListItem ({
  id,
  first_name,
  last_name,
  address_country,
  company,
  primary,
  created_on,
  modified_on,
}) {
  return {
    id,
    type: 'contact',
    name: `${first_name} ${last_name}`,
    meta: [
      {
        label: 'Contact type',
        value: primary ? 'Primary' : null,
        type: 'badge',
      },
      {
        label: 'Company',
        value: get(company, 'name'),
      },
      {
        label: 'Country',
        value: get(address_country, 'name'),
        isLabelHidden: true,
      },
      {
        label: 'Created',
        type: 'datetime',
        value: created_on,
      },
      {
        label: 'Modified',
        type: 'datetime',
        value: modified_on,
      },
    ],
  }
}

module.exports = {
  transformContactToListItem,
}
