import { get, includes } from 'lodash'

import {
  STATUS,
  BADGES,
  INTERACTION_SERVICES,
  INTERACTION_SERVICEOTHER,
} from '../constants'
import urls from '../../../../lib/urls'

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

const getCompanyInteractionUrl = (activity) => {
  const companyId = activity.object.attributedTo[0].id.split(':').pop()
  const interactionId = activity.id.split(':')[2]
  return urls.companies.interactions.detail(companyId, interactionId)
}

export const getServiceText = (service) => {
  const serviceType = service.includes(' : ')
    ? service.split(' : ')[0]
    : service

  const serviceText =
    (service.includes('Making') && service.includes('Introductions')) ||
    service.includes('introductions')
      ? 'Introduction'
      : service.includes('Advice & Information') ||
          service.includes('advice and information')
        ? 'Advice and information'
        : service.includes('Investment Enquiry') ||
            service.includes('Investment enquiry')
          ? 'Enquiry'
          : service.includes('Stova Event Service')
            ? 'Stova Event'
            : INTERACTION_SERVICES[serviceType]
  return serviceText
}

export const getServiceOtherText = (service) => {
  let serviceType = service
  if (INTERACTION_SERVICEOTHER[service] !== undefined) {
    serviceType = INTERACTION_SERVICEOTHER[service]
  }
  return serviceType
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

    const service = get(activity, 'object.dit:service.name')
    const serviceText = service ? getServiceText(service) : null

    const themeText = getThemeText(activity)
    const communicationChannel = get(
      activity,
      'object.dit:communicationChannel.name'
    )
    const interactionUrl = getCompanyInteractionUrl(activity)

    return {
      badge,
      isUpcoming,
      typeText,
      serviceText,
      themeText,
      communicationChannel,
      interactionUrl,
    }
  }
}
