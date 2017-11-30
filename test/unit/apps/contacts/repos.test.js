const nock = require('nock')
const config = require('~/config')

const {
  getContactsForCompany,
} = require('~/src/apps/contacts/repos')

const contactsApiResult = require('~/test/unit/data/contacts/contact-api-result.json')
const companyId = '23232323'

describe('Investment repository', () => {
  describe('#getContactsForCompany', () => {
    nock(config.apiRoot)
      .get(`/v3/contact?company_id=${companyId}&limit=500`)
      .reply(200, contactsApiResult)

    it('should return company contacts array', async () => {
      const actual = await getContactsForCompany('token', companyId)

      return expect(actual).to.deep.equal(contactsApiResult.results)
    })
  })
})
