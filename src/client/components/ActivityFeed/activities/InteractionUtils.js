import { get, includes } from 'lodash'
import { STATUS, BADGES } from '../constants'

const getStatus = (activity) => {
  const apiStatus = get(activity, 'object.dit:status')

  if (apiStatus === STATUS.DRAFT) {
    const isArchived = get(activity, 'object.dit:archived')
    if (isArchived) {
      return STATUS.CANCELLED
    }
    const startTime = get(activity, 'object.startTime')
    const isUpcoming = new Date(startTime) > new Date()
    return isUpcoming ? STATUS.UPCOMING : STATUS.INCOMPLETE
  }

  return STATUS.COMPLETE
}

const isServiceDelivery = (activity) => {
  const activityTypes = get(activity, 'object.type')
  return includes(activityTypes, 'dit:ServiceDelivery')
}

const getServiceText = (activity) => {
  const service = get(activity, 'object.dit:service.name')
  const serviceText = service.includes(
    'A Specific DIT Export Service or Funding'
  )
    ? 'Service or Funding'
    : service.includes('A Specific Service')
    ? 'Specific Service'
    : service.includes('Account Management')
    ? 'Account Management'
    : service.includes('COP26')
    ? 'COP26'
    : service.includes('Enquiry or Referral Received')
    ? 'Enquiry or Referral'
    : service.includes('Enquiry received') ||
      service.includes('Investment Enquiry')
    ? 'Enquiry'
    : service.includes('Events')
    ? 'Event'
    : service.includes('Export Win')
    ? 'Export Win'
    : service.includes('Global Investment Summit (2021)')
    ? 'Global Investment Summit (2021)'
    : service.includes('IST Aftercare Offered')
    ? 'IST Aftercare'
    : service.includes('Investment - Services')
    ? 'Service'
    : service.includes('IST Specific Service')
    ? 'IST Service'
    : service.includes('Making') && service.includes('Introductions')
    ? 'Introduction'
    : service.includes('Proposition Development')
    ? 'Proposition Development'
    : service.includes('Advice & Information')
    ? 'Advice & Information'
    : service.includes('Trade Agreement Implementation Activity')
    ? 'Implementation'
    : null
  return serviceText
}

const getThemeText = (activity) => {
  const themeTypes = get(activity, 'object.type')
  const themeText = includes(themeTypes, 'dit:datahub:theme:export')
    ? 'export'
    : includes(themeTypes, 'dit:datahub:theme:investment')
    ? 'investment'
    : includes(themeTypes, 'dit:datahub:theme:trade_agreement')
    ? 'trade agreement'
    : includes(themeTypes, 'dit:datahub:theme:other')
    ? 'other'
    : null
  return themeText
}

export default class InteractionUtils {
  static transform(activity) {
    const status = getStatus(activity)

    const badge = isServiceDelivery(activity)
      ? BADGES.INTERACTION.SERVICE_DELIVERY
      : BADGES.INTERACTION[status.toUpperCase()]

    const isUpcoming = status === STATUS.UPCOMING
    const typeText = isServiceDelivery(activity)
      ? 'service delivery'
      : 'interaction'

    const serviceText = getServiceText(activity)
    const themeText = getThemeText(activity)
    const communicationChannel = get(
      activity,
      'object.dit:communicationChannel.name'
    )

    return {
      badge,
      isUpcoming,
      typeText,
      serviceText,
      themeText,
      communicationChannel,
    }
  }
}
