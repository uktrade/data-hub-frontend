import { apiProxyAxios } from '../../../components/Task/utils'

export const removeAttendee = (interactionId) =>
  apiProxyAxios.post(`/v3/interaction/${interactionId}/archive`, {
    reason: 'attendee removed from event',
  })
