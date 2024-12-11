import urls from '../../../../lib/urls'
import { formatDate, DATE_FORMAT_MEDIUM } from '../../../utils/date-utils'
import {
  pluraliseLabel,
  formattedAdvisers,
  formattedContacts,
} from '../../Companies/CompanyActivity/transformers'
import { INTERACTION_NAMES } from '../../../../apps/interactions/constants'

export const transformContactActivityToListItem = ({
  date,
  subject,
  dit_participants,
  service,
  id,
  contacts,
  kind,
  communication_channel,
}) => ({
  id,
  metadata: [
    { label: 'Date', value: formatDate(date, DATE_FORMAT_MEDIUM) },
    {
      label: pluraliseLabel(contacts.length, 'Contact'),
      value: formattedContacts(contacts),
    },
    { label: 'Communication channel', value: communication_channel?.name },
    {
      label: pluraliseLabel(dit_participants.length, 'Adviser'),
      value: formattedAdvisers(dit_participants),
    },
    { label: 'Service', value: service?.name },
  ].filter(({ value }) => Boolean(value)),
  tags: [
    {
      text: INTERACTION_NAMES[kind],
      colour: 'grey',
      dataTest: 'activity-kind-label',
    },
    {
      text:
        service && service?.name.includes(' : ')
          ? service?.name.split(' : ')[0]
          : service?.name,
      colour: 'blue',
      dataTest: 'activity-service-label',
    },
  ].filter(({ text }) => Boolean(text)),
  headingUrl: urls.interactions.detail(id),
  headingText: subject,
})

export const transformResponseToCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformContactActivityToListItem),
})
