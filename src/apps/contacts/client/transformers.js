/* eslint-disable camelcase */
const { get, compact } = require('lodash')

const { formatWithTime } = require('../../../client/utils/date-utils')
const { contactMetaItemLabels } = require('../labels')
const urls = require('../../../lib/urls')

const getTelephoneNumber = (telephone_countrycode, telephone_number) =>
  telephone_countrycode
    ? `(${telephone_countrycode}) ${telephone_number}`
    : telephone_number

export const transformArchivedToApi = (archived) =>
  archived?.length === 1 ? archived[0] === 'true' : undefined

export const transformContactToListItem = ({
  id,
  first_name,
  last_name,
  job_title,
  address_country,
  company_uk_region,
  company,
  modified_on,
  archived,
  company_sector,
  primary,
  telephone_countrycode,
  telephone_number,
  email,
} = {}) => {
  const telephoneNumber = getTelephoneNumber(
    telephone_countrycode,
    telephone_number
  )

  const metadata = [
    { label: 'company', value: get(company, 'name') },
    { label: 'job_title', value: job_title },
    { label: 'company_sector', value: get(company_sector, 'name') },
    { label: 'address_country', value: get(address_country, 'name') },
    { label: 'company_uk_region', value: get(company_uk_region, 'name') },
    { label: 'telephone', value: telephoneNumber },
    { label: 'email', value: email },
  ]
    .filter((item) => item.value)
    .map(({ label, value }) => ({
      label: contactMetaItemLabels[label],
      value,
    }))

  const badges = [
    { text: primary ? 'Primary' : null },
    { text: archived ? 'Archived' : null },
  ].filter((item) => item.text)

  return {
    id,
    metadata: compact(metadata),
    headingUrl: urls.contacts.details(id),
    badges: badges.filter((item) => item.text),
    headingText: `${first_name} ${last_name}`.trim(),
    subheading: `Updated on ${formatWithTime(modified_on)}`,
  }
}

export const transformResponseToCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformContactToListItem),
})
