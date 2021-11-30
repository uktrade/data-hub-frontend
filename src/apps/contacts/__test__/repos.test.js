const config = require('../../../config')

const { getContactsForCompany, getContact } = require('../repos')

const contactsApiResult = require('../../../../test/unit/data/contacts/contact-api-result.json')

const companyId = '23232323'
const stubRequest = { session: { token: 'abcd' } }

describe('Contacts repository', () => {
  describe('#getContactsForCompany', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/contact?company_id=${companyId}&limit=500`)
        .reply(200, contactsApiResult)
      this.contacts = await getContactsForCompany(stubRequest, companyId)
    })

    it('should return company contacts array', async () => {
      expect(this.contacts).to.deep.equal(contactsApiResult.results)
    })
  })

  describe('#getContact', () => {
    it('should request from the v4 endpoint without needing a feature flag', async () => {
      const contactId = 'acb8fa10-af78-4c80-99cb-0c5605d677a7'
      const request = {
        session: {
          token: 'DUMMY',
        },
      }

      const v4contactRequest = nock(config.apiRoot)
        .get(`/v4/contact/${contactId}`)
        .reply(200, {})
      await getContact(request, contactId)
      expect(v4contactRequest.isDone()).to.be.true
    })
  })
})
