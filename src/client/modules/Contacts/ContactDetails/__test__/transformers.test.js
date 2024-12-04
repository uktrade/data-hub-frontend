import 'core-js/proposals/array-grouping-v2'
import { transformContactConsents } from '../transformers'

describe('transformContactConsents', () => {
  context('When a falsey contact is passed', () => {
    it('Should return undefined', () => {
      expect(transformContactConsents(undefined)).to.be.undefined
    })
  })

  context('When a contact has no consent data', () => {
    it('Should return undefined', () => {
      expect(transformContactConsents({})).to.be.undefined
    })
  })

  context('When a contact with a single unique value for domain', () => {
    it('Should return a single domain with a single topic', () => {
      expect(
        transformContactConsents({
          consentData: [
            {
              topic: 'Topic 1',
              sourceSystem: 'System A',
              consentDomain: 'International',
              emailContactConsent: false,
              telephoneContactConsent: false,
            },
          ],
        })
      ).to.deep.equal([
        {
          domain: 'International',
          consentedTopics: [],
          notConsentedTopics: [{ consent: false, name: 'Topic 1' }],
        },
      ])
    })
  })

  context('When a contact has multiple values for domain', () => {
    it('Should return a single domain with multiple topics', () => {
      expect(
        transformContactConsents({
          consentData: [
            {
              topic: 'Topic 1',
              sourceSystem: 'System A',
              consentDomain: 'International',
              emailContactConsent: false,
              telephoneContactConsent: false,
            },
            {
              topic: 'Topic 2',
              sourceSystem: 'System A',
              consentDomain: 'International',
              emailContactConsent: false,
              telephoneContactConsent: true,
            },
          ],
        })
      ).to.deep.equal([
        {
          domain: 'International',
          consentedTopics: [
            {
              consent: true,
              name: 'Topic 2',
            },
          ],
          notConsentedTopics: [{ consent: false, name: 'Topic 1' }],
        },
      ])
    })
  })
})
