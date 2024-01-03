import { get } from 'lodash'

import urls from '../../../../lib/urls'
import { formatMediumDateTime } from '../../../utils/date'

export const transformContactToListItem = (companyId, eventId) => (contact) => {
  const metadata = [
    { label: 'Company', value: get(contact.company, 'name') },
    { label: 'Job title', value: contact.job_title },
    { label: 'Sector', value: get(contact.company_sector, 'name') },
    { label: 'Country', value: get(contact.address_country, 'name') },
    { label: 'UK region', value: get(contact.company_uk_region, 'name') },
    { label: 'Phone number', value: contact.full_telephone_number },
    { label: 'Email', value: contact.email },
  ].filter((item) => !(item.label === 'Company' && companyId))

  const badges = [{ text: contact.primary ? 'Primary' : null }]

  return {
    id: contact.id,
    metadata: metadata.filter((item) => item.value),
    headingUrl: urls.events.addAttendee(eventId, contact.id),
    badges: badges.filter((item) => item.text),
    headingText: `${contact.first_name} ${contact.last_name}`.trim(),
    subheading: `Updated on ${formatMediumDateTime(contact.modified_on)}`,
  }
}

export const transformResponseToCollection = (
  companyId,
  eventId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformContactToListItem(companyId, eventId)),
})
