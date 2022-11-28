const { expect } = require('chai')
const { endOfYesterday, endOfTomorrow } = require('date-fns')
const {
  EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_ATTENDEES_STATUS_AFTER_EVENT,
} = require('../../../../apps/companies/apps/activity-feed/constants')
const {
  transformResponseToEventAventriDetails,
  transformAventriEventStatus,
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

describe('#transformAventriEventStatus', () => {
  context('Check mapping of aventri event status', () => {
    it('Empty list of allowedStatuses returns empty array', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: [],
        registrationStatuses: [
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.confirmed, count: 20 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 10 },
        ],
      })
      expect(result).to.deep.equal([])
    })

    it('Empty list of registrationStatuses returns empty array', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [],
      })
      expect(result).to.deep.equal([])
    })

    it('Only registration values that have a mapping are returned', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [
          { status: 'NOT_REAL', count: 20 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 10 },
        ],
      })
      expect(result).to.deep.equal([])
    })

    it('Only registration values in the list of allowed status are returned', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.confirmed, count: 20 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 10 },
        ],
      })
      expect(result).to.deep.equal([])
    })

    it('Only registration values with count greater than 0 are returned', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_AFTER_EVENT,
        registrationStatuses: [
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 0 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.noShow, count: 10 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.waitlist, count: 20 },
        ],
      })
      expect(result).to.deep.equal([
        {
          count: 10,
          status: 'Did not attend',
          urlSlug: 'did-not-attend',
        },
        {
          count: 20,
          status: 'Waiting list',
          urlSlug: 'waiting-list',
        },
      ])
    })

    it('Registration values with grouped values return the total of all statuses', () => {
      const result = transformAventriEventStatus({
        allowedStatuses: EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
        registrationStatuses: [
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.confirmed, count: 5 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 10 },
        ],
      })
      expect(result).to.deep.equal([
        {
          count: 15,
          status: 'Registered',
          urlSlug: 'registered',
        },
      ])
    })
  })
})
