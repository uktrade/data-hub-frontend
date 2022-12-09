const {
  EVENT_AVENTRI_ATTENDEES_MAPPING,
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_ATTENDEES_STATUS,
} = require('../../../../../apps/companies/apps/activity-feed/constants')
const { mapUrlSlugToAventriRegistrationStatuses } = require('../state')

describe('mapUrlSlugToAventriRegistrationStatuses', () => {
  let registrationStatus, aventriRegistrationStatuses

  context('when urlSlug is null', () => {
    before(() => {
      ;({ registrationStatus, aventriRegistrationStatuses } =
        mapUrlSlugToAventriRegistrationStatuses(null))
    })

    it('registrationStatus should be null', () => {
      expect(registrationStatus).to.be.null
    })

    it('aventriRegistrationStatuses should be empty array', () => {
      expect(aventriRegistrationStatuses).to.be.empty
    })
  })

  context('when urlSlug contains a value that is not a known status', () => {
    before(() => {
      ;({ registrationStatus, aventriRegistrationStatuses } =
        mapUrlSlugToAventriRegistrationStatuses('FAKE'))
    })

    it('registrationStatus should be null', () => {
      expect(registrationStatus).to.be.null
    })

    it('aventriRegistrationStatuses should be empty array', () => {
      expect(aventriRegistrationStatuses).to.be.empty
    })
  })

  context('when urlSlug contains a known status', () => {
    before(() => {
      ;({ registrationStatus, aventriRegistrationStatuses } =
        mapUrlSlugToAventriRegistrationStatuses(
          EVENT_AVENTRI_ATTENDEES_MAPPING[
            EVENT_AVENTRI_ATTENDEES_STATUS.activated
          ].urlSlug
        ))
    })

    it('registrationStatus should be equal to the matching status', () => {
      expect(registrationStatus).to.be.equal(EVENT_ATTENDEES_STATUS.registered)
    })

    it('aventriRegistrationStatuses should be an array with the matching status', () => {
      expect(aventriRegistrationStatuses).to.be.deep.equal([
        EVENT_AVENTRI_ATTENDEES_STATUS.activated,
        EVENT_AVENTRI_ATTENDEES_STATUS.confirmed,
      ])
    })
  })
})
