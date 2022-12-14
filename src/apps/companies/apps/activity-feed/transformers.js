const { endOfToday, isAfter } = require('date-fns')
const { get } = require('lodash')
const {
  EVENT_ATTENDEES_MAPPING,
  EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
  EVENT_ATTENDEES_STATUS_AFTER_EVENT,
} = require('./constants')

const transformAventriEventStatusCountsToEventStatusCounts = (
  aventriStatusCounts
) =>
  Object.entries(EVENT_ATTENDEES_MAPPING).map(([key, value]) => ({
    status: key,
    urlSlug: value.urlSlug,
    count: aventriStatusCounts
      .filter((s) => value.statuses.includes(s.status))
      .reduce((sum, cur) => sum + cur.count, 0),
  }))

const transformAventriEventStatusToEventStatus = (aventriStatus) => {
  const matchingStatus = Object.entries(EVENT_ATTENDEES_MAPPING).find(
    ([, value]) => value.statuses.includes(aventriStatus)
  )
  return matchingStatus ? matchingStatus[0] : undefined
}

const filterAttendeesByEventStatus = (event, attendees) => {
  const futureEvent = isEventInFuture(event)

  if (futureEvent === undefined) {
    return []
  }
  const allowedStatuses = futureEvent
    ? EVENT_ATTENDEES_STATUS_BEFORE_EVENT
    : EVENT_ATTENDEES_STATUS_AFTER_EVENT
  return attendees.filter((f) => allowedStatuses.includes(f.registrationStatus))
}

/**
 * Returns whether the event is in the future or not
 * @param {*} event
 * @returns {boolean} True, false or undefined
 */
const isEventInFuture = (event) => {
  const today = endOfToday()
  const endTime = get(event, 'object.endTime')
  return endTime !== undefined ? isAfter(new Date(endTime), today) : undefined
}

module.exports = {
  transformAventriEventStatusCountsToEventStatusCounts,
  transformAventriEventStatusToEventStatus,
  filterAttendeesByEventStatus,
  isEventInFuture,
}
