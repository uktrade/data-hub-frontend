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
        country: contactAddressFields.address_country,
      }
}

function getTelephoneNumber(telephone_countrycode, telephone_number) {
  return telephone_countrycode
    ? `(${telephone_countrycode}) ${telephone_number}`
    : telephone_number
}

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
  telephone_countrycode,
  telephone_number,
  email,
} = {}) {
  if (!id || (!first_name && !last_name)) {
    return
  }

  const telephoneNumber = getTelephoneNumber(
    telephone_countrycode,
    telephone_number
  )

  const metaItems = [
    { key: 'company', value: get(company, 'name') },
    { key: 'job_title', value: job_title },
    { key: 'company_sector', value: get(company_sector, 'name') },
    { key: 'address_country', value: get(address_country, 'name') },
    { key: 'company_uk_region', value: company_uk_region },
    { key: 'telephone', value: telephoneNumber },
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
  },
  company
) {
  const viewRecord = {
    job_title,
    email,
    telephone_alternative,
    email_alternative,
    notes,
    telephone_number: getTelephoneNumber(
      telephone_countrycode,
      telephone_number
    ),
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
