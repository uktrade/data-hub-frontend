import React from 'react'
import Link from '@govuk-react/link'

import { TAGS } from './constants'
import urls from '../../../../lib/urls'
import { formatMediumDateParsed } from '../../../utils/date'
import { truncateData } from '../utils'
import { AdviserResource } from '../../../components/Resource'
import { INTERACTION_NAMES } from '../../../../apps/interactions/constants'
import { getServiceText } from '../../../components/ActivityFeed/activities/InteractionUtils'

const { isEmpty } = require('lodash')

const AdviserEmail = (props) => (
  <AdviserResource.Inline {...props}>
    {(adviser) => adviser.email}
  </AdviserResource.Inline>
)

const AdviserRenderer = ({ adviser, team }) => {
  const email = adviser.email ? adviser.email : <AdviserEmail id={adviser.id} />
  const emailLink = <Link href={`mailto:${email}`}> {email}</Link>
  const teamString = team ? `${team.name} ` : null
  return (
    <>
      <span>{adviser.name}</span> {emailLink}
      {teamString ? `, ${teamString}` : ''} <br />
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

  Removes any sources which does not have a transformer.
*/
export const transformActivities = (activities) => {
  const transformedActivites = activities.results.map((activity) => {
    const activity_source = activity.activity_source

    switch (activity_source) {
      case 'interaction':
        return transformInteractionToListItem(activity)
      case 'referral':
        return transformReferralToListItem(activity)
      case 'investment':
        return transformInvestmentToListItem(activity)
      case 'order':
        return transformOrderToListItem(activity)
      case 'great_export_enquiry':
        return transformGreatExportEnquiryToListItem(activity)
      default:
        return {}
    }
  })

  return transformedActivites.filter(
    (transformedActivity) => !isEmpty(transformedActivity)
  )
}

export const transformInteractionToListItem = (activity) => {
  const interaction = activity.interaction
  const companyId = activity.company.id
  return {
    id: interaction.id,
    metadata: [
      {
        label: 'Date',
        value: interaction.date ? formatMediumDateParsed(interaction.date) : '',
      },
      {
        label: verifyLabel(interaction.contacts, 'Contact'),
        value: formattedContacts(interaction.contacts),
      },
      {
        label: 'Communication channel',
        value: interaction.communication_channel?.name,
      },
      {
        label: verifyLabel(interaction.dit_participants, 'Adviser'),
        value: formattedAdvisers(interaction.dit_participants),
      },
      { label: 'Service', value: interaction.service?.name },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      {
        text: INTERACTION_NAMES[interaction.kind],
        colour: 'grey',
        dataTest: 'activity-kind-label',
      },
      {
        text: interaction.service
          ? getServiceText(interaction.service?.name)
          : '',
        colour: 'blue',
        dataTest: 'activity-service-label',
      },
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.companies.interactions.detail(companyId, interaction.id),
    headingText: interaction.subject,
  }
}

export const transformReferralToListItem = (activity) => {
  const referral = activity.referral
  return {
    id: referral.id,
    metadata: [
      {
        label: 'Created on',
        value: formatMediumDateParsed(referral.created_on),
      },
      {
        label: 'Completed on',
        value: referral.completed_on
          ? formatMediumDateParsed(referral.completed_on)
          : '',
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
      { label: 'Created Date', value: formatMediumDateParsed(activity.date) },
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

export const transformOrderToListItem = (activity) => {
  return {
    id: activity.order.id,
    metadata: [
      { label: 'Date', value: formatMediumDateParsed(activity.date) },
      {
        label: 'Country',
        value: activity.order.primary_market.name,
      },
      activity.order.uk_region
        ? {
            label: 'UK region',
            value: activity.order.uk_region.name,
          }
        : '',
      {
        label: 'Added by',
        value: activity.order.created_by
          ? AdviserRenderer({
              adviser: activity.order.created_by,
              team: activity.order.created_by.dit_team,
            })
          : '',
      },
      {
        label: 'Company Contact',
        value:
          activity.order.contact.name + ' ' + activity.order.contact.job_title,
      },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      {
        text: 'Orders (OMIS)',
        colour: 'default',
        dataTest: 'order-theme-label',
      },
      {
        text: 'Event',
        colour: 'blue',
        dataTest: 'order-service-label',
      },
      {
        text: 'New Order',
        colour: 'grey',
        dataTest: 'order-kind-label',
      },
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.omis.order(activity.order.id),
    headingText: activity.order.reference,
  }
}

export const transformGreatExportEnquiryToListItem = (activity) => {
  const great = activity.great_export_enquiry
  return {
    id: great.id,
    metadata: [
      { label: 'Date', value: formatMediumDateParsed(activity.date) },
      {
        label: 'Contact',
        value: formattedContacts([great.contact]),
      },
      {
        label: 'Comment',
        value: truncateData(great.data_enquiry),
      },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      {
        text: 'great.gov.uk Enquiry',
        colour: TAGS.ACTIVITY_LABELS.KIND,
        dataTest: 'great-kind-label',
      },
      {
        text: 'service',
        colour: TAGS.ACTIVITY_LABELS.SERVICE,
        dataTest: 'great-service-label',
      },
      {
        text: 'great.gov.uk',
        colour: TAGS.ACTIVITY_LABELS.THEME,
        dataTest: 'great-theme-label',
      },
    ].filter(({ text }) => Boolean(text)),
    headingText: `Enquiry ` + truncateData(great.meta_subject, 35),
  }
}

export const transformResponseToCollection = (activities) => ({
  // activities.count comes from the backend because the frontend
  // only collects the paginated amount on each request. If a new data
  // source is added to the backend and not the frontend this count
  // will show more activities than are displayed until the frontend is updated.
  count: activities.count,
  results: transformActivities(activities),
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
