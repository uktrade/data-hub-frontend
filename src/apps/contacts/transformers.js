/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

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
        label: archived_on ? 'Archived' : 'Updated',
        type: 'datetime',
        value: archived_on || modified_on,
      },
      {
        label: 'Sector',
        value: get(company_sector, 'name'),
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

  item.meta.push(
    {
      label: 'Country',
      type: 'badge',
      value: get(address_country, 'name'),
    })

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
