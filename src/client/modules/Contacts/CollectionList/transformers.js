import { get } from 'lodash'

import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'

import urls from '../../../../lib/urls'

export const transformArchivedToApi = (archived) =>
  archived?.length === 1 ? archived[0] === 'true' : undefined

export const transformContactToListItem = (companyId) => (contact) => {
  const metadata = [
    { label: 'Company', value: get(contact.company, 'name') },
    { label: 'Job title', value: contact.job_title },
    { label: 'Sector', value: get(contact.company_sector, 'name') },
    { label: 'Country', value: get(contact.address_country, 'name') },
    { label: 'UK region', value: get(contact.company_uk_region, 'name') },
    { label: 'Phone number', value: contact.full_telephone_number },
    { label: 'Email', value: contact.email },
  ].filter((item) => !(item.label === 'Company' && companyId))

  const tags = [
    {
      text: contact.valid_email === false ? 'UNKNOWN EMAIL' : null,
      colour: 'pink',
    },
    { text: contact.primary ? 'Primary' : null, colour: 'turquoise' },
    { text: contact.archived ? 'Archived' : null, colour: 'grey' },
  ]

  return {
    id: contact.id,
    metadata: metadata.filter((item) => item.value),
    headingUrl: urls.contacts.details(contact.id),
    tags: tags.filter((item) => item.text),
    headingText: `${contact.first_name} ${contact.last_name}`.trim(),
    subheading: `Updated on ${formatDate(contact.modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`,
  }
}

export const transformResponseToCollection = (
  companyId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformContactToListItem(companyId)),
})
