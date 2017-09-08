/* eslint-disable camelcase */
const { get } = require('lodash')

function transformContactToListItem ({
  id,
  first_name,
  last_name,
  address_country,
  company,
  modified_on,
  archived,
  archived_by,
  archived_on,
  archived_reason,
  company_sector,
} = {}) {
  if (!id || !first_name || !last_name) { return }

  const item = {
    id,
    type: 'contact',
    name: `${first_name} ${last_name}`.trim(),
    isArchived: archived,
    meta: [
      {
        label: 'Company',
        value: get(company, 'name'),
      },
      {
        label: archived_on ? 'Archived' : 'Updated',
        type: 'datetime',
        value: archived_on || modified_on,
      },
      {
        label: 'Sector',
        value: get(company_sector, 'name'),
      },
      {
        label: 'Country',
        type: 'badge',
        value: get(address_country, 'name'),
      },
    ],
  }

  if (archived_reason) {
    item.meta.push({
      label: 'Reason to archive',
      value: archived_reason,
    })
  }

  if (archived_by) {
    item.meta.push({
      label: 'Archived by',
      value: archived_by,
    })
  }

  return item
}

module.exports = {
  transformContactToListItem,
}
