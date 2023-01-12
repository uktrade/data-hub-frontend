const {
  EVENT_ATTENDEES_STATUS,
  EVENT_ATTENDEES_MAPPING,
} = require('../../../../../apps/companies/apps/activity-feed/constants')
const { mapUrlSlugToRegistrationStatus } = require('../state')

describe('mapUrlSlugToRegistrationStatus', () => {
  let registrationStatus

  context('when urlSlug is null', () => {
    before(() => {
      registrationStatus = mapUrlSlugToRegistrationStatus(null)
    })

    it('registrationStatus should be null', () => {
      expect(registrationStatus).to.be.null
    })
  })

  context('when urlSlug contains a value that is not a known status', () => {
    before(() => {
      registrationStatus = mapUrlSlugToRegistrationStatus('FAKE')
    })

    it('registrationStatus should be null', () => {
      expect(registrationStatus).to.be.null
    })
  })

  context('when urlSlug contains a known status', () => {
    before(() => {
      registrationStatus = mapUrlSlugToRegistrationStatus(
        EVENT_ATTENDEES_MAPPING[EVENT_ATTENDEES_STATUS.registered].urlSlug
      )
    })

    it('registrationStatus should be equal to the matching status', () => {
      expect(registrationStatus).to.be.equal(EVENT_ATTENDEES_STATUS.registered)
    })
  })
})
