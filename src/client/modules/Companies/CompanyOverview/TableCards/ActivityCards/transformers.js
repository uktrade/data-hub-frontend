import { isFuture } from 'date-fns'

import {
  TAGS,
  NEW_PROJECT_TAG,
  NEW_ORDER_TAG,
  GREAT_EXPORT_TAG,
  EYB_TAG,
} from '../../../CompanyActivity/constants'
import { formatDate, DATE_FORMAT_MEDIUM } from '../../../../../utils/date-utils'
import { truncateData } from '../../../../../utils/truncate'
import { INTERACTION_NAMES } from '../../../../../../apps/interactions/constants'
import urls from '../../../../../../lib/urls'
import { pluraliseLabel } from '../../../CompanyActivity/transformers'
import { capitaliseFirstLetter } from './ActivityCard'

const { isEmpty } = require('lodash')

const transformAdvisers = (advisers) => {
  const stringAdvisers = advisers.map((value) => value.adviser.name).join(', ')

  const lastCommaIndex = stringAdvisers.lastIndexOf(', ')
  return (
    stringAdvisers.substring(0, lastCommaIndex) +
    ' and' +
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
    ' and' +
    stringContacts.substring(lastCommaIndex + 1)
  )
}

const buildSummary = (advisers, communicationChannel, contacts, date) => {
  const transformedAdvisers =
    advisers.length > 1 ? transformAdvisers(advisers) : advisers[0].adviser.name
  const transformedContacts =
    contacts.length > 1 ? transformContacts(contacts) : contacts[0].name
  const isFutureDate = isFuture(date) ? 'will have' : 'had'

  return `${transformedAdvisers} ${isFutureDate} ${transformCommunicationChannel(communicationChannel)} contact with ${transformedContacts}`
}

const checkNewJobs = (jobs) => (jobs > 0 ? jobs : 'no')

const buildOrderSummary = (order) => {
  const summaryFirstPart = order.primary_market
    ? `Export to ${order.primary_market?.name} `
    : ''
  const summary = order.created_by
    ? `${summaryFirstPart}added by ${order.created_by.name}`
    : summaryFirstPart

  return capitaliseFirstLetter(summary)
}

/*
  From the activity_source field from the API, determine which transformer to
  use to get the required data for the cards.
*/
export const transformActivity = (activities) => {
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

export const transformReferralToListItem = (activity) => {
  const referral = activity.referral
  const summary = `Company was referred to ${referral.recipient.name} by ${referral.created_by.name}`

  const date =
    !referral.completedOn && formatDate(referral.created_on, DATE_FORMAT_MEDIUM)

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

export const transformInteractionToListItem = (activity) => {
  const interaction = activity.interaction
  const companyId = activity.company.id
  return {
    id: interaction.id,
    date: interaction.date
      ? formatDate(interaction.date, DATE_FORMAT_MEDIUM)
      : '',
    tags: [
      {
        text: INTERACTION_NAMES[interaction.kind],
        colour: 'grey',
        dataTest: 'activity-kind-label',
      },
    ],
    headingUrl: urls.companies.interactions.detail(companyId, interaction.id),
    headingText: interaction.subject,
    summary: buildSummary(
      interaction.dit_participants,
      interaction.communication_channel?.name,
      interaction.contacts,
      interaction.date
    ),
  }
}

function getInvestmentSummary(activity) {
  let investment = activity.investment
  let summary = `${investment.investment_type.name} investment`
  if (investment.number_new_jobs === null) {
    summary = summary + ` added by ${investment.created_by.name}`
  } else {
    summary =
      summary +
      ` for ${checkNewJobs(investment.number_new_jobs)} ${pluraliseLabel(investment.number_new_jobs, 'new job')} added by ${investment.created_by.name}`
  }
  if (activity.investment.eyb_leads.length !== 0) {
    summary = summary + ' from EYB lead'
  }
  return summary
}

export const transformInvestmentToListItem = (activity) => {
  const investment = activity.investment
  return {
    id: investment.id,
    date: formatDate(activity.date, DATE_FORMAT_MEDIUM),
    tags: [NEW_PROJECT_TAG].filter(({ text }) => Boolean(text)),
    headingUrl: urls.investments.projects.details(investment.id),
    headingText: investment.name,
    summary: getInvestmentSummary(activity),
  }
}

export const transformOrderToListItem = (activity) => {
  const order = activity.order
  return {
    id: order.id,
    date: formatDate(activity.date, DATE_FORMAT_MEDIUM),
    tags: [NEW_ORDER_TAG].filter(({ text }) => Boolean(text)),
    headingUrl: urls.omis.order(order.id),
    headingText: order.reference,
    summary: buildOrderSummary(order),
  }
}

export const transformGreatExportEnquiryToListItem = (activity) => {
  const greatExportEnquiry = activity.great_export_enquiry
  return {
    id: greatExportEnquiry.id,
    date: formatDate(activity.date, DATE_FORMAT_MEDIUM),
    tags: [GREAT_EXPORT_TAG].filter(({ text }) => Boolean(text)),
    headingText: truncateData(greatExportEnquiry.meta_subject, 35),
    summary:
      greatExportEnquiry.contact.name.length > 0
        ? `Enquirer ${greatExportEnquiry.contact?.name}`
        : 'Unknown enquirer',
  }
}

export const transformResponseToCollection = (activities) => ({
  count: activities.count,
  results: transformActivity(activities),
})

export const getEYBValue = (activity) => {
  const eybValue = activity.eyb_lead.is_high_value

  switch (eybValue) {
    case true:
      return 'A high'
    case false:
      return 'A low'
    default:
      return 'An unknown'
  }
}

export const transformEYBLeadToListItem = (activity) => {
  return {
    id: activity.eyb_lead.id,
    date: formatDate(activity.eyb_lead.created_on),
    tags: [EYB_TAG].filter(({ text }) => Boolean(text)),
    headingUrl: urls.investments.eybLeads.details(activity.eyb_lead.id),
    headingText: activity.company.name
      ? activity.company.name
      : activity.eyb_lead.company_name,
    summary: `${getEYBValue(activity)}-value EYB lead associated with this company has been added to Data Hub`,
  }
}
