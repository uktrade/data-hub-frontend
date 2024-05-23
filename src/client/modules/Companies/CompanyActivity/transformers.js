import React from 'react'
import Link from '@govuk-react/link'

import urls from '../../../../lib/urls'
import { formatMediumDate } from '../../../utils/date'
import { AdviserResource } from '../../../components/Resource'
import { INTERACTION_NAMES } from '../../../../apps/interactions/constants'

const AdviserEmail = (props) => (
  <AdviserResource.Inline {...props}>
    {(adviser) => adviser.email}
  </AdviserResource.Inline>
)

const AdviserRenderer = ({ adviser, team }) => {
  const email = <AdviserEmail id={adviser.id} />
  const emailLink = <Link href={`mailto:${email}`}> {email}</Link>
  const teamString = team ? `${team.name} ` : null
  return (
    <>
      <span>{adviser.name}</span> {emailLink}, {teamString} <br />
    </>
  )
}

const formattedContacts = (contacts) =>
  !!contacts.length &&
  contacts.map((contact, index) => (
    <span key={contact.name}>
      {index ? ', ' : ''}
      <Link
        data-test={`contact-link-${index}`}
        href={urls.contacts.details(contact.id)}
      >
        {contact.name}
      </Link>
    </span>
  ))

const formattedAdvisers = (advisers) =>
  !!advisers.length &&
  advisers.map((item) => (
    <span key={item.adviser.name}>
      <AdviserRenderer adviser={item.adviser} team={item.team} />
    </span>
  ))

const verifyLabel = (array, label) => (array.length > 1 ? label + 's' : label)

export const transformInteractionToListItem = ({
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
    { label: 'Date', value: formatMediumDate(date) },
    {
      label: verifyLabel(contacts, 'Contact'),
      value: formattedContacts(contacts),
    },
    { label: 'Communication channel', value: communication_channel?.name },
    {
      label: verifyLabel(dit_participants, 'Adviser'),
      value: formattedAdvisers(dit_participants),
    },
    { label: 'Service', value: service.name },
  ].filter(({ value }) => Boolean(value)),
  tags: [
    {
      text: INTERACTION_NAMES[kind],
      colour: 'grey',
      dataTest: 'activity-kind-label',
    },
    {
      text:
        service && service.name.includes(' : ')
          ? service.name.split(' : ')[0]
          : service.name,
      colour: 'blue',
      dataTest: 'activity-service-label',
    },
  ].filter(({ text }) => Boolean(text)),
  headingUrl: urls.interactions.detail(id),
  headingText: subject,
})

export const transformResponseToCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformInteractionToListItem),
})
