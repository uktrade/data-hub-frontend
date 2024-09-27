import { TAGS } from '../../../CompanyActivity/constants'
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

/*
  From the activity_source field from the API, determine which transformer to
  use to get the required data for the cards.
*/
export const transformActivity = (activity) => {
  const activity_source = activity.activity_source

  if (activity_source === 'interaction')
    return transformInteractionToListItem(activity.interaction)
  else if (activity_source === 'referral')
    return transformReferralToListItem(activity)
}

export const transformReferralToListItem = (activity) => {
  const referral = activity.referral
  const summary = `
    Completed sending adviser ${referral.created_by.name} \
    receiving adviser ${referral.recipient.name}
  `

  const date = !referral.completedOn && formatMediumDate(referral.created_on)

  return {
    id: referral.id,
    date: date,
    tags: [
      {
        text: TAGS.REFERRAL[referral.status.toUpperCase()].text,
        colour: TAGS.REFERRAL[referral.status.toUpperCase()].colour,
        dataTest: 'referral-label',
      },
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.companies.referrals.details(
      activity.company.id,
      referral.id
    ),
    headingText: referral.subject,
    summary: summary,
  }
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

export const transformResponseToCollection = (activities) => ({
  count: activities.count,
  results: activities.results.map(transformActivity),
})
