import React from 'react'
import Link from '@govuk-react/link'

import {
  TAGS,
  NEW_PROJECT_TAG,
  NEW_ORDER_TAG,
  GREAT_EXPORT_TAG,
  INVESTMENT_TAG,
  EYB_TAG,
} from './constants'
import urls from '../../../../lib/urls'
import { formatDate, DATE_FORMAT_MEDIUM } from '../../../utils/date-utils'
import { truncateData } from '../utils'
import { AdviserResource } from '../../../components/Resource'
import { INTERACTION_NAMES } from '../../../../apps/interactions/constants'
import { getServiceText } from '../../../components/ActivityFeed/activities/InteractionUtils'
import { currencyGBP } from '../../../utils/number-utils'

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

export const pluraliseLabel = (number, label) =>
  number != 1 ? label + 's' : label

const formatContactName = (contact) =>
  contact.job_title ? contact.name + ', ' + contact.job_title : contact.name

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
      case 'eyb_lead':
        return transformEYBLeadToListItem(activity)
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
        value:
          interaction.date && formatDate(interaction.date, DATE_FORMAT_MEDIUM),
      },
      {
        label: pluraliseLabel(interaction.contacts?.length, 'Contact'),
        value: formattedContacts(interaction.contacts),
      },
      {
        label: 'Communication channel',
        value: interaction.communication_channel?.name,
      },
      {
        label: pluraliseLabel(interaction.dit_participants?.length, 'Adviser'),
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
        text: interaction.service && getServiceText(interaction.service?.name),
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
        value: formatDate(referral.created_on, DATE_FORMAT_MEDIUM),
      },
      {
        label: 'Completed on',
        value:
          referral.completed_on &&
          formatDate(referral.completed_on, DATE_FORMAT_MEDIUM),
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
  const project = activity.investment
  return {
    id: project.id,
    metadata: [
      {
        label: 'Created on',
        value: formatDate(activity.date, DATE_FORMAT_MEDIUM),
      },
      {
        label: 'Investment type',
        value: project.investment_type.name,
      },
      {
        label: 'Added by',
        value:
          activity.investment.created_by &&
          AdviserRenderer({
            adviser: activity.investment.created_by,
            team: activity.investment.created_by.dit_team,
          }),
      },
      {
        label: 'Estimated land date',
        value: formatDate(project.estimated_land_date, DATE_FORMAT_MEDIUM),
      },
      {
        label: pluraliseLabel(
          project.client_contacts?.length,
          'Company contact'
        ),
        value:
          project.client_contacts.length > 0
            ? project.client_contacts.map((contact) => contact.name).join(', ')
            : '',
      },
      {
        label: 'Total investment',
        value: currencyGBP(project.total_investment),
      },
      {
        label: 'Capital expenditure value',
        value: currencyGBP(project.foreign_equity_investment),
      },
      {
        label: 'Gross value added (GVA)',
        value: currencyGBP(project.gross_value_added),
      },
      { label: 'Number of jobs', value: project.number_new_jobs },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      activity.investment.eyb_leads.length !== 0 && EYB_TAG,
      INVESTMENT_TAG,
      {
        text: `Project - ${project.investment_type.name}`,
        colour: 'blue',
        dataTest: 'investment-type-label',
      },
      NEW_PROJECT_TAG,
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.investments.projects.details(project.id),
    headingText: project.name,
  }
}

export const transformOrderToListItem = (activity) => {
  const order = activity.order
  return {
    id: order.id,
    metadata: [
      { label: 'Date', value: formatDate(activity.date, DATE_FORMAT_MEDIUM) },
      {
        label: 'Country',
        value: order.primary_market.name,
      },
      order.uk_region && {
        label: 'UK region',
        value: order.uk_region.name,
      },
      {
        label: 'Added by',
        value:
          order.created_by &&
          AdviserRenderer({
            adviser: order.created_by,
            team: order.created_by.dit_team,
          }),
      },
      {
        label: 'Company contact',
        value: formatContactName(order.contact),
      },
    ].filter((entry) => entry && Boolean(entry.value)),
    tags: [
      {
        text: 'Orders (OMIS)',
        colour: 'govBlue',
        dataTest: 'order-theme-label',
      },
      {
        text: 'Event',
        colour: 'blue',
        dataTest: 'order-service-label',
      },
      NEW_ORDER_TAG,
    ].filter(({ text }) => Boolean(text)),
    headingUrl: urls.omis.order(order.id),
    headingText: order.reference,
  }
}

export const transformGreatExportEnquiryToListItem = (activity) => {
  const greatExportEnquiry = activity.great_export_enquiry
  const contact = greatExportEnquiry.contact
  return {
    id: greatExportEnquiry.id,
    metadata: [
      {
        label: '',
        value: truncateData(greatExportEnquiry.data_enquiry),
      },
      { label: 'Date', value: formatDate(activity.date, DATE_FORMAT_MEDIUM) },
      {
        label: 'Contact',
        value: contact.name.length && contact.name,
      },
      { label: 'Job title', value: contact?.job_title },
      { label: 'Email', value: greatExportEnquiry.meta_email_address },
    ].filter(({ value }) => Boolean(value)),
    tags: [
      {
        text: 'great.gov.uk Enquiry',
        colour: TAGS.ACTIVITY_LABELS.THEME,
        dataTest: 'great-theme-label',
      },
      {
        text: 'Export',
        colour: TAGS.ACTIVITY_LABELS.SERVICE,
        dataTest: 'great-service-label',
      },
      GREAT_EXPORT_TAG,
    ].filter(({ text }) => Boolean(text)),
    headingText: `Enquiry ` + truncateData(greatExportEnquiry.meta_subject, 35),
  }
}

export const getEYBValue = (activity) => {
  const eybValue = activity.eyb_lead.is_high_value

  switch (eybValue) {
    case true:
      return 'High'
    case false:
      return 'Low'
    default:
      return 'Unknown'
  }
}

export const transformEYBLeadToListItem = (activity) => {
  return {
    id: activity.eyb_lead.id,
    metadata: [
      {
        label: 'Submitted to EYB date',
        value: formatDate(activity.eyb_lead.triage_created),
      },
      {
        label: 'Value',
        value: getEYBValue(activity),
      },
    ].filter(({ value }) => Boolean(value)),
    tags: [EYB_TAG, INVESTMENT_TAG].filter(({ text }) => Boolean(text)),
    headingUrl: urls.investments.eybLeads.details(activity.eyb_lead.id),
    headingText: activity.company.name
      ? activity.company.name
      : activity.eyb_lead.company_name,
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
