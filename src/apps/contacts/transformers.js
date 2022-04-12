/* eslint-disable camelcase */
const { get, pickBy, compact, assign } = require('lodash')

const { getDataLabels } = require('../../lib/controller-utils')
const { contactDetailsLabels, contactMetaItemLabels } = require('./labels')

function getContactAddress(
  address_same_as_company,
  contactAddressFields,
  company
) {
  return address_same_as_company
    ? company.address
    : {
        line_1: contactAddressFields.address_1,
        line_2: contactAddressFields.address_2,
        town: contactAddressFields.address_town,
        county: contactAddressFields.address_county,
        postcode: contactAddressFields.address_postcode,
        area: contactAddressFields.address_area,
        country: contactAddressFields.address_country,
      }
}

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

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @param {object} company
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function transformContactToView(
  {
    full_telephone_number,
    job_title,
    email,
    accepts_dit_email_marketing,
    address_1,
    address_2,
    address_town,
    address_county,
    address_postcode,
    address_area,
    address_country,
    notes,
    address_same_as_company,
  },
  company
) {
  const viewRecord = {
    job_title,
    email,
    notes,
    full_telephone_number,
    email_marketing: accepts_dit_email_marketing
      ? 'Can be marketed to'
      : 'Cannot be marketed to',
    address: {
      type: 'address',
      address: getContactAddress(
        address_same_as_company,
        {
          address_1,
          address_2,
          address_town,
          address_county,
          address_postcode,
          address_area,
          address_country,
        },
        company
      ),
    },
  }

  return pickBy(getDataLabels(viewRecord, contactDetailsLabels))
}

module.exports = {
  transformContactToListItem,
  transformContactToView,
}
