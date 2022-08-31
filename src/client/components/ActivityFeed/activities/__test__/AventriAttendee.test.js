import dateModule from '../../../../utils/date'
import {
  AVENTRI_ATTENDEE_REG_STATUSES,
  transformAventriAttendee,
} from '../AventriAttendee'

describe('transformAventriAttendee', () => {
  let registrationStatus
  const activity = () => ({
    endDate: '2023-02-14T20:09:14',
    startDate: '2022-02-14T20:09:14',
    object: {
      'dit:registrationStatus': registrationStatus,
      attributedTo: {
        id: 'dit:aventri:Attendee:1111',
      },
    },
  })

  let dateStub
  beforeEach(() => {
    dateStub = sinon
      .stub(dateModule, 'formatStartAndEndDate')
      .returns('mock date')
  })

  describe('registration status', () => {
    Object.entries(AVENTRI_ATTENDEE_REG_STATUSES).forEach(([key, value]) => {
      describe(`status is ${key}`, () => {
        it(`should return "${value}"`, () => {
          registrationStatus = key
          expect(transformAventriAttendee(activity()).registrationStatus).to.eq(
            value
          )
        })
      })
    })

    describe('status is not recognised', () => {
      it('should return undefined', () => {
        registrationStatus = 'Something'
        expect(transformAventriAttendee(activity()).registrationStatus).to.eq(
          undefined
        )
      })
    })

    describe('status is undefined', () => {
      it('should return undefined', () => {
        registrationStatus = undefined
        expect(transformAventriAttendee(activity()).registrationStatus).to.eq(
          undefined
        )
      })
    })
  })

  describe('date', () => {
    it('calls "formatStartAndEndDate"', () => {
      transformAventriAttendee(activity())
      dateStub.calledWith(activity().startDate, activity().endDate)
    })
  })

  describe('aventri id', () => {
    it('should extract and return the id number', () => {
      expect(transformAventriAttendee(activity()).eventId).to.eq('1111')
    })
  })
})
