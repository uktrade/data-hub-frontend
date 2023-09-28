import { transformAventriEventStatusCountsToEventStatusCounts } from '../transformers'
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
