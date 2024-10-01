import React from 'react'
import Link from '@govuk-react/link'

import { TAGS } from './constants'
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

export const formattedContacts = (contacts) =>
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

export const formattedAdvisers = (advisers) =>
  !!advisers.length &&
  advisers.map((item) => (
    <span key={item.adviser.name}>
      <AdviserRenderer adviser={item.adviser} team={item.team} />
    </span>
  ))

export const verifyLabel = (array, label) =>
  array.length > 1 ? label + 's' : label

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
  else if (activity_source === 'investment')
    return transformInvestmentToListItem(activity)
}

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
        service && service.name.includes(' : ')
          ? service.name.split(' : ')[0]
          : service?.name,
      colour: 'blue',
      dataTest: 'activity-service-label',
    },
  ].filter(({ text }) => Boolean(text)),
  headingUrl: urls.interactions.detail(id),
  headingText: subject,
})

export const transformReferralToListItem = (activity) => {
  const referral = activity.referral
  return {
    id: referral.id,
    metadata: [
      { label: 'Created Date', value: formatMediumDate(referral.created_on) },
      {
        label: 'Completed Date',
        value: formatMediumDate(referral.completed_on),
      },
      {
        label: 'Sending adviser',
        value: AdviserRenderer({
          adviser: referral.created_by,
          team: referral.created_by.dit_team,
        }),
      },
      {
        label: 'Receiving adviser',
        value: AdviserRenderer({
          adviser: referral.recipient,
          team: referral.recipient.dit_team,
        }),
      },
    ].filter(({ value }) => Boolean(value)),
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
  }
}

export const transformInvestmentToListItem = (activity) => {
  return {
    id: activity.investment.id,
    metadata: [
      { label: 'Created Date', value: formatMediumDate(activity.date) },
      {
        label: 'Investment Type',
        value: activity.investment.investment_type.name,
      },
      {
        label: 'Added by',
        value: activity.investment.created_by
          ? AdviserRenderer({
              adviser: activity.investment.created_by,
              team: activity.investment.created_by.dit_team,
            })
          : '',
      },
      {
        label: 'Estimated land date',
        value: activity.investment.estimated_land_date,
      },
      {
        label: 'Company Contact',
        value: activity.investment.clinet_contacts,
      },
      {
        label: 'Total investment',
        value: activity.investment.total_investment,
      },
      {
        label: 'Capital expenditure value',
        value: activity.investment.foreign_equity_investment,
      },
      {
        label: 'Gross value added (GVA)',
        value: activity.investment.gross_value_added,
      },
      { label: 'Number of jobs', value: activity.investment.number_new_jobs },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      {
        text: 'Investment',
        colour: 'default',
        dataTest: 'investment-theme-label',
      },
      {
        text: 'New Investment Project',
        colour: 'grey',
        dataTest: 'investment-service-label',
      },
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.investments.projects.details(activity.investment.id),
    headingText: activity.investment.name,
  }
}

export const transformResponseToCollection = (activities) => ({
  count: activities.count,
  results: activities.results.map(transformActivity),
})

export const filterServiceNames = (services) => {
  if (!services) return

  const excludedParentServices = [
    'A Specific DBT Export Service or Funding',
    'A Specific Service',
    'Enquiry or Referral Received',
    'Enquiry Received',
  ]
  const filteredServiceNames = services
    .map((service) => {
      const [parent, child] = service.label.split(' : ')
      const isParentExcluded = excludedParentServices.includes(parent)
      const label = isParentExcluded && child ? child : service.label
      const value = service.value
      return { label, value }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  return filteredServiceNames
}
