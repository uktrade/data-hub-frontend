import urls from '../../../../lib/urls'
import { formatMediumDateParsed } from '../../../utils/date'
import {
  verifyLabel,
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
    { label: 'Date', value: formatMediumDateParsed(date) },
    {
      label: verifyLabel(contacts, 'Contact'),
      value: formattedContacts(contacts),
    },
    { label: 'Communication channel', value: communication_channel?.name },
    {
      label: verifyLabel(dit_participants, 'Adviser'),
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
