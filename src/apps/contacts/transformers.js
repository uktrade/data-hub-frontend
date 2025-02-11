const { get, pickBy, compact, assign } = require('lodash')

const { contactMetaItemLabels } = require('./labels')

// The new react collection page no longer uses this transformer as it
// has its own. When searching for a contact '/search/contacts?term=<search-term>'
// or viewing a contact within companies '/companies/<company-id>/contacts'
// this function is called, therefore, we cannot remove it until both of
// those areas have been rewritten in react.
function transformContactToListItem({
  id,
  first_name,
  last_name,
  job_title,
  address_country,
  company_uk_region,
  company,
  modified_on,
  archived,
  archived_on,
  company_sector,
  primary,
  full_telephone_number,
  email,
  valid_email,
} = {}) {
  if (!id || (!first_name && !last_name)) {
    return
  }

  const metaItems = [
    { key: 'company', value: get(company, 'name') },
    { key: 'job_title', value: job_title },
    { key: 'company_sector', value: get(company_sector, 'name') },
    { key: 'address_country', value: get(address_country, 'name') },
    { key: 'company_uk_region', value: company_uk_region },
    { key: 'telephone', value: full_telephone_number },
    { key: 'email', value: email },
    {
      key: 'valid_email',
      value: valid_email === false ? 'UNKNOWN EMAIL' : null,
      type: 'badge',
    },
    {
      key: 'contact_type',
      value: primary ? 'Primary' : null,
      type: 'badge',
      badgeModifier: 'secondary',
    },
    {
      key: 'archived_on',
      value: archived_on ? 'Archived' : null,
      type: 'badge',
    },
  ].map(({ key, value, type, badgeModifier }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier }), {
      label: contactMetaItemLabels[key],
    })
  })

  return {
    id,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    type: 'contact',
    name: `${first_name} ${last_name}`.trim(),
    isArchived: archived,
    meta: compact(metaItems),
  }
}

module.exports = {
  transformContactToListItem,
}
