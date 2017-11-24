/* eslint-disable camelcase */
const { get, pickBy, findIndex } = require('lodash')

const { getFormattedAddress } = require('../../lib/address')
const { getDataLabels } = require('../../lib/controller-utils')
const { contactDetailsLabels } = require('./labels')

function getContactAddress (address_same_as_company, contactAddressFields, company) {
  if (!address_same_as_company) {
    return getFormattedAddress(contactAddressFields)
  }

  return getFormattedAddress(company, 'trading') || getFormattedAddress(company, 'registered')
}

function transformContactToListItem ({
  id,
  first_name,
  last_name,
  address_country,
  company_uk_region,
  company,
  modified_on,
  archived,
  archived_by,
  archived_on,
  archived_reason,
  company_sector,
  primary,
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
        label: 'Sector',
        value: get(company_sector, 'name'),
      },
      {
        label: 'Country',
        value: get(address_country, 'name'),
      },
      {
        label: 'Updated on',
        type: 'datetime',
        value: modified_on,
      },
    ],
  }

  // Add Contact type as first badge to be displayed
  if (primary) {
    item.meta.push({
      label: 'Contact type',
      value: 'Primary',
      type: 'badge',
      badgeModifier: 'secondary',
    })
  }

  if (archived_on) {
    item.meta.push({
      label: 'Status',
      type: 'badge',
      value: 'Archived',
    })
  }

  if (company_uk_region) {
    const countryIndex = findIndex(item.meta, ['label', 'Country'])
    item.meta.splice((countryIndex + 1), 0, {
      label: 'Uk Region',
      value: company_uk_region,
    })
  }

  return item
}

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @param {object} company
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function transformContactToView ({
  telephone_countrycode,
  telephone_number,
  job_title,
  email,
  accepts_dit_email_marketing,
  address_1,
  address_2,
  address_town,
  address_county,
  address_postcode,
  address_country,
  telephone_alternative,
  email_alternative,
  notes,
  address_same_as_company,
}, company) {
  const telephoneNumber =
    telephone_countrycode
      ? `(${telephone_countrycode}) ${telephone_number}`
      : telephone_number

  const viewRecord = {
    job_title,
    email,
    telephone_alternative,
    email_alternative,
    notes,
    telephone_number: telephoneNumber,
    email_marketing: accepts_dit_email_marketing ? 'Yes' : 'No',
    address: getContactAddress(address_same_as_company, {
      address_1,
      address_2,
      address_town,
      address_county,
      address_postcode,
      address_country,
    }, company),
  }

  return pickBy(getDataLabels(viewRecord, contactDetailsLabels))
}

module.exports = {
  transformContactToListItem,
  transformContactToView,
}
