const {
  transformAventriEventStatusCountsToEventStatusCounts,
  filterAttendeesByEventStatus,
} = require('../transformers')

import { endOfTomorrow, endOfYesterday } from 'date-fns'
import {
  EVENT_ATTENDEES_MAPPING,
  EVENT_ATTENDEES_STATUS,
  EVENT_AVENTRI_ATTENDEES_STATUS,
} from '../constants'

describe('#transformAventriEventStatusCountsToEventStatusCounts', () => {
  context(
    'when there are both known and unknown aventri statuses to transform',
    () => {
      let transformResult

      before(() => {
        transformResult = transformAventriEventStatusCountsToEventStatusCounts([
          { status: 'FAKE', count: 17 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.activated, count: 5 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.attended, count: 9 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.cancelled, count: 14 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.confirmed, count: 3 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.noShow, count: 45 },
          { status: EVENT_AVENTRI_ATTENDEES_STATUS.waitlist, count: 1 },
        ])
      })

      it('does not include unknown statuses', () => {
        expect(transformResult).to.deep.not.include({
          status: 'FAKE',
          count: 17,
        })
      })

      it('returns known statuses in a grouped format', () => {
        expect(transformResult).to.deep.include({
          status: EVENT_ATTENDEES_STATUS.cancelled,
          urlSlug:
            EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.cancelled].urlSlug,
          count: 14,
        })
        expect(transformResult).to.deep.include({
          status: EVENT_ATTENDEES_STATUS.attended,
          urlSlug:
            EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.attended].urlSlug,
          count: 9,
        })
        expect(transformResult).to.deep.include({
          status: EVENT_ATTENDEES_STATUS.didNotAttend,
          urlSlug:
            EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.didNotAttend]
              .urlSlug,
          count: 45,
        })
        expect(transformResult).to.deep.include({
          status: EVENT_ATTENDEES_STATUS.waitingList,
          urlSlug:
            EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.waitingList].urlSlug,
          count: 1,
        })
        expect(transformResult).to.deep.include({
          status: EVENT_ATTENDEES_STATUS.registered,
          urlSlug:
            EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.registered].urlSlug,
          count: 8,
        })
      })
    }
  )
})

describe('#filterAttendeesByEventStatus', () => {
  const attendees = [
    { registrationStatus: null, id: 1 },
    { registrationStatus: EVENT_ATTENDEES_STATUS.registered, id: 2 },
    { registrationStatus: EVENT_ATTENDEES_STATUS.cancelled, id: 3 },
    { registrationStatus: EVENT_ATTENDEES_STATUS.attended, id: 4 },
    { registrationStatus: EVENT_ATTENDEES_STATUS.waitingList, id: 5 },
    { registrationStatus: EVENT_ATTENDEES_STATUS.didNotAttend, id: 6 },
  ]
  context('when there is no endTime', () => {
    it('should return an empty array', () => {
      const result = filterAttendeesByEventStatus()
      expect(result).to.be.empty
    })

    context('When event date is in the past', () => {
      it('should return attendees with a status allowed for past events', () => {
        const result = filterAttendeesByEventStatus(
          {
            object: { endTime: endOfYesterday() },
          },
          attendees
        )
        expect(result).to.be.deep.equal([
          { registrationStatus: EVENT_ATTENDEES_STATUS.registered, id: 2 },
          { registrationStatus: EVENT_ATTENDEES_STATUS.cancelled, id: 3 },
        ])
      })
    })

    context('When event date is today', () => {
      it('should return attendees with a status allowed for past events', () => {
        const result = filterAttendeesByEventStatus(
          {
            object: { endTime: new Date() },
          },
          attendees
        )
        expect(result).to.be.deep.equal([
          { registrationStatus: EVENT_ATTENDEES_STATUS.registered, id: 2 },
          { registrationStatus: EVENT_ATTENDEES_STATUS.cancelled, id: 3 },
        ])
      })
    })

    context('When event date is in the future', () => {
      it('should return attendees with a status allowed for future events', () => {
        const result = filterAttendeesByEventStatus(
          {
            object: { endTime: endOfTomorrow() },
          },
          attendees
        )
        expect(result).to.be.deep.equal([
          { registrationStatus: EVENT_ATTENDEES_STATUS.cancelled, id: 3 },
          { registrationStatus: EVENT_ATTENDEES_STATUS.attended, id: 4 },
          { registrationStatus: EVENT_ATTENDEES_STATUS.waitingList, id: 5 },
          { registrationStatus: EVENT_ATTENDEES_STATUS.didNotAttend, id: 6 },
        ])
      })
    })
  })
})
