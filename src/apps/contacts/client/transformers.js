/* eslint-disable camelcase */
const { get } = require('lodash')

const { formatMediumDateTime } = require('../../../client/utils/date')
const urls = require('../../../lib/urls')

const getTelephoneNumber = (telephone_countrycode, telephone_number) =>
  telephone_countrycode
    ? `(${telephone_countrycode}) ${telephone_number}`
    : telephone_number

export const transformArchivedToApi = (archived) =>
  archived?.length === 1 ? archived[0] === 'true' : undefined

export const transformContactToListItem = (companyId) => (contact) => {
  const telephoneNumber = getTelephoneNumber(
    contact.telephone_countrycode,
    contact.telephone_number
  )

  const metadata = [
    { label: 'Company', value: get(contact.company, 'name') },
    { label: 'Job title', value: contact.job_title },
    { label: 'Sector', value: get(contact.company_sector, 'name') },
    { label: 'Country', value: get(contact.address_country, 'name') },
    { label: 'UK region', value: get(contact.company_uk_region, 'name') },
    { label: 'Phone number', value: telephoneNumber },
    { label: 'Email', value: contact.email },
  ].filter((item) => !(item.label === 'Company' && companyId))

  const badges = [
    { text: contact.primary ? 'Primary' : null },
    { text: contact.archived ? 'Archived' : null },
  ]

  return {
    id: contact.id,
    metadata: metadata.filter((item) => item.value),
    headingUrl: urls.contacts.details(contact.id),
    badges: badges.filter((item) => item.text),
    headingText: `${contact.first_name} ${contact.last_name}`.trim(),
    subheading: `Updated on ${formatMediumDateTime(contact.modified_on)}`,
  }
}

export const transformResponseToCollection = (
  companyId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformContactToListItem(companyId)),
})
