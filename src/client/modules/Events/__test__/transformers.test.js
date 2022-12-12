const { expect } = require('chai')
const { endOfYesterday, endOfTomorrow } = require('date-fns')
const {
  EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
  EVENT_ATTENDEES_STATUS,
  EVENT_ATTENDEES_STATUS_AFTER_EVENT,
} = require('../../../../apps/companies/apps/activity-feed/constants')
const {
  transformResponseToEventAventriDetails,
  filterEventStatus,
} = require('../transformers')

describe('#transformResponseToEventAventriDetails', () => {
  context('Calculate if upcomingEvent is set correctly', () => {
    it('When event date missing should be false', () => {
      const result = transformResponseToEventAventriDetails({ object: {} })
      expect(result.upcomingEvent).to.be.false
    })

    it('When event date is in the past should be false', () => {
      const result = transformResponseToEventAventriDetails({
        object: { endTime: endOfYesterday() },
      })
      expect(result.upcomingEvent).to.be.false
    })

    it('When event date today should be false', () => {
      const result = transformResponseToEventAventriDetails({
        object: { endTime: new Date() },
      })
      expect(result.upcomingEvent).to.be.false
    })

    it('When event date is in the future should be true', () => {
      const result = transformResponseToEventAventriDetails({
        object: { endTime: endOfTomorrow() },
      })
      expect(result.upcomingEvent).to.be.true
    })
  })
})

describe('#filterEventStatus', () => {
  context('Check mapping of aventri event status', () => {
    it('Empty list of allowedStatuses returns empty array', () => {
      const result = filterEventStatus({
        allowedStatuses: [],
        registrationStatuses: [
          { status: EVENT_ATTENDEES_STATUS.registered, count: 20 },
          { status: EVENT_ATTENDEES_STATUS.cancelled, count: 10 },
        ],
      })
      expect(result).to.deep.equal([])
    })

    it('Empty list of registrationStatuses returns empty array', () => {
      const result = filterEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [],
      })
      expect(result).to.deep.equal([])
    })

    it('Only registration values that have a mapping are returned', () => {
      const result = filterEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [
          { status: 'NOT_REAL', count: 20 },
          { status: EVENT_ATTENDEES_STATUS.attended, count: 10 },
        ],
      })
      expect(result).to.deep.equal([
        { status: EVENT_ATTENDEES_STATUS.attended, count: 10 },
      ])
    })

    it('Only registration values in the list of allowed status are returned', () => {
      const result = filterEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
        registrationStatuses: [
          { status: EVENT_ATTENDEES_STATUS.waitingList, count: 20 },
          { status: EVENT_ATTENDEES_STATUS.didNotAttend, count: 10 },
        ],
      })
      expect(result).to.deep.equal([])
    })

    it('Only registration values with count greater than 0 are returned', () => {
      const result = filterEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [
          { status: EVENT_ATTENDEES_STATUS.attended, count: 0 },
          { status: EVENT_ATTENDEES_STATUS.didNotAttend, count: 10 },
          { status: EVENT_ATTENDEES_STATUS.waitingList, count: 20 },
        ],
      })
      expect(result).to.deep.equal([
        {
          count: 10,
          status: 'Did not attend',
        },
        {
          count: 20,
          status: 'Waiting list',
        },
      ])
    })
  })
})
