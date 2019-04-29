/* eslint prefer-promise-reject-errors: 0 */
const companyData = require('~/test/unit/data/company.json')
const companyV4Data = require('~/test/unit/data/companies/company-v4.json')
const companyCHData = require('~/test/unit/data/companies/companies-house-company.json')

const config = require('~/config')

const { getDitCompany, getCHCompany } = require('~/src/apps/companies/repos.js')

describe('Company repository', () => {
  describe('Save company', () => {
    describe('Make correct call to API', () => {
      beforeEach(() => {
        this.authorisedRequestStub = sinon.stub().resolves({
          id: 'TEST_TOKEN',
          name: 'fred',
        })
        this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
      })

      it('should call the API with a PATCH if an ID is provided.', async () => {
        await this.repo.saveCompany('TEST_TOKEN', { id: 'TEST_TOKEN', name: 'fred' })
        expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
          body: { id: 'TEST_TOKEN', name: 'fred' },
          method: 'PATCH',
          url: 'http://localhost:8000/v4/company/TEST_TOKEN',
        })
      })

      it('should call the API with a POST if no ID is provided.', async () => {
        await this.repo.saveCompany('TEST_TOKEN', { name: 'fred' })
        expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
          body: { name: 'fred' },
          method: 'POST',
          url: 'http://localhost:8000/v4/company',
        })
      })
    })
  })

  describe('Update company', () => {
    beforeEach(() => {
      this.authorisedRequestStub = sinon.stub().resolves(companyData)
      this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
    })

    it('should make the correct call to the API', async () => {
      await this.repo.updateCompany('TEST_TOKEN', '999', { global_headquarters: '1' })
      expect(this.authorisedRequestStub).to.be.calledOnceWithExactly('TEST_TOKEN', {
        url: 'http://localhost:8000/v4/company/999',
        method: 'PATCH',
        body: {
          global_headquarters: '1',
        },
      })
    })
  })

  describe('#getDitCompany', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get(`/v4/company/${companyV4Data.id}`)
        .reply(200, companyV4Data)
    })

    it('should return company', async () => {
      const company = await getDitCompany('TEST_TOKEN', companyV4Data.id)
      expect(company).to.deep.equal(companyV4Data)
    })
  })

  describe('#getCHCompany', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v4/ch-company/${companyCHData.id}`)
        .reply(200, companyCHData)
    })

    it('should return company', async () => {
      const company = await getCHCompany('TEST_TOKEN', companyCHData.id)
      expect(company).to.deep.equal(companyCHData)
    })
  })

  function makeRepositoryWithAuthRequest (authorisedRequestStub) {
    return proxyquire('~/src/apps/companies/repos', {
      '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
    })
  }
})
