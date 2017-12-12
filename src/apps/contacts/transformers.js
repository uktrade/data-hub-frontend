/* eslint-disable camelcase */
const { get, pickBy, compact, assign } = require('lodash')

const { getFormattedAddress } = require('../../lib/address')
const { getDataLabels } = require('../../lib/controller-utils')
const { contactDetailsLabels, contactMetaItemLabels } = require('./labels')

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
  job_title,
  address_country,
  company_uk_region,
  company,
  modified_on,
  archived,
  archived_on,
  company_sector,
  primary,
} = {}) {
  if (!id || !first_name || !last_name) { return }

  const metaItems = [
    { key: 'company', value: get(company, 'name') },
    { key: 'job_title', value: job_title },
    { key: 'company_sector', value: get(company_sector, 'name') },
    { key: 'address_country', value: get(address_country, 'name') },
    { key: 'company_uk_region', value: company_uk_region },
    { key: 'modified_on', value: modified_on, type: 'datetime' },
    { key: 'contact_type', value: (primary ? 'Primary' : null), type: 'badge', badgeModifier: 'secondary' },
    { key: 'archived_on', value: (archived_on ? 'Archived' : null), type: 'badge' },
  ].map(({ key, value, type, badgeModifier }) => {
    if (!value) return
    return assign({}, pickBy({ value, type, badgeModifier }), {
      label: contactMetaItemLabels[key],
    })
  })

  return {
    id,
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
