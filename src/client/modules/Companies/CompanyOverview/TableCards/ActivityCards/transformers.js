import { formatMediumDate, isDateInFuture } from '../../../../../utils/date'
import { INTERACTION_NAMES } from '../../../../../../apps/interactions/constants'
import urls from '../../../../../../lib/urls'

const transformAdvisers = (advisers) => {
  const stringAdvisers = advisers.map((value) => value.adviser.name).join(', ')

  const lastCommaIndex = stringAdvisers.lastIndexOf(', ')
  return (
    stringAdvisers.substring(0, lastCommaIndex) +
    ' and ' +
    stringAdvisers.substring(lastCommaIndex + 1)
  )
}

const transformCommunicationChannel = (channel) =>
  channel ? channel.toLowerCase() : ''

const transformContacts = (contacts) => {
  const stringContacts = contacts.map((value) => value.name).join(', ')

  const lastCommaIndex = stringContacts.lastIndexOf(', ')
  return (
    stringContacts.substring(0, lastCommaIndex) +
    ' and ' +
    stringContacts.substring(lastCommaIndex + 1)
  )
}

const buildSummary = (advisers, communicationChannel, contacts, date) => {
  const transformedAdvisers =
    advisers.length > 1 ? transformAdvisers(advisers) : advisers[0].adviser.name
  const transformedContacts =
    contacts.length > 1 ? transformContacts(contacts) : contacts[0].name
  const isFuture = isDateInFuture(date) ? 'will have' : 'had'

  return `${transformedAdvisers} ${isFuture} ${transformCommunicationChannel(communicationChannel)} contact with ${transformedContacts}`
}

export const transformInteractionToListItem = ({
  date,
  subject,
  id,
  kind,
  communication_channel,
  dit_participants,
  contacts,
}) => ({
  id,
  date: formatMediumDate(date),
  tags: [
    {
      text: INTERACTION_NAMES[kind],
      colour: 'grey',
      dataTest: 'activity-kind-label',
    },
  ],
  headingUrl: urls.interactions.detail(id),
  headingText: subject,
  summary: buildSummary(
    dit_participants,
    communication_channel?.name,
    contacts,
    date
  ),
})

export const transformResponseToCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformInteractionToListItem),
})
