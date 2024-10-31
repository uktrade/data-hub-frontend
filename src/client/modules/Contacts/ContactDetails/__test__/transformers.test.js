import 'core-js/proposals/array-grouping-v2'
import { transformContactConsents } from '../transformers'

describe('transformContactConsents', () => {
  context('When a falsey contact is passed', () => {
    it('Should return false', () => {
      expect(transformContactConsents(undefined)).to.equal(false)
    })
  })

  context('When a contact has no consent data', () => {
    it('Should return false', () => {
      expect(transformContactConsents({})).to.equal(false)
    })
  })

  context(
    'When a contact has a single domain and has not given consent',
    () => {
      it('Should return false', () => {
        expect(
          transformContactConsents({
            consentData: [
              {
                consentDomain: 'International',
                emailContactConsent: false,
              },
            ],
          })
        ).to.equal(false)
      })
    }
  )

  context('When a contact has a single domain and has given consent', () => {
    it('Should return true', () => {
      expect(
        transformContactConsents({
          consentData: [
            {
              consentDomain: 'International',
              emailContactConsent: true,
            },
          ],
        })
      ).to.equal(true)
    })
  })

  context(
    'When a contact has a multiple domains and has given consent to one',
    () => {
      it('Should return true', () => {
        expect(
          transformContactConsents({
            consentData: [
              {
                consentDomain: 'International',
                emailContactConsent: true,
              },
              {
                consentDomain: 'International',
                emailContactConsent: false,
              },
            ],
          })
        ).to.equal(true)
      })
    }
  )

  context(
    'When a contact has a multiple domains and has given consent to all',
    () => {
      it('Should return true', () => {
        expect(
          transformContactConsents({
            consentData: [
              {
                consentDomain: 'International',
                emailContactConsent: true,
              },
              {
                consentDomain: 'International',
                emailContactConsent: true,
              },
            ],
          })
        ).to.equal(true)
      })
    }
  )
})
