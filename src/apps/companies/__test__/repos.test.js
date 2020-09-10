/* eslint prefer-promise-reject-errors: 0 */
const proxyquire = require('proxyquire')

const companyData = require('../../../../test/unit/data/company.json')
const companyV4Data = require('../../../../test/unit/data/companies/company-v4.json')
const myCompanyListData = require('../../../../test/unit/data/companies/my-company-list.json')
const config = require('../../../config')
const {
  generateExportCountries,
} = require('../../../../test/unit/helpers/generate-export-countries')

const {
  getDitCompany,
  saveDnbCompany,
  saveCompanyExportDetails,
} = require('../repos')

function makeRepositoryWithAuthRequest(authorisedRequestStub) {
  return proxyquire('../repos', {
    '../../lib/authorised-request': {
      authorisedRequest: authorisedRequestStub,
    },
  })
}

describe('Company repository', () => {
  const stubRequest = { session: { token: 'TEST_TOKEN' } }

  describe('Save company', () => {
    describe('Make correct call to API', () => {
      let authorisedRequestStub
      let repo

      beforeEach(() => {
        authorisedRequestStub = sinon.stub().resolves({
          id: 'TEST_TOKEN',
          name: 'fred',
        })
        repo = makeRepositoryWithAuthRequest(authorisedRequestStub)
      })

      it('should call the API with a PATCH if an ID is provided.', async () => {
        await repo.saveCompany(stubRequest, {
          id: 'TEST_TOKEN',
          name: 'fred',
        })
        expect(authorisedRequestStub).calledOnceWithExactly(stubRequest, {
          body: { id: 'TEST_TOKEN', name: 'fred' },
          method: 'PATCH',
          url: `${config.apiRoot}/v4/company/TEST_TOKEN`,
        })
      })

      it('should call the API with a POST if no ID is provided.', async () => {
        await repo.saveCompany(stubRequest, { name: 'fred' })
        expect(authorisedRequestStub).calledOnceWithExactly(stubRequest, {
          body: { name: 'fred' },
          method: 'POST',
          url: `${config.apiRoot}/v4/company`,
        })
      })
    })
  })

  describe('Update company', () => {
    it('should make the correct call to the API', async () => {
      const authorisedRequestStub = sinon.stub().resolves(companyData)
      const repo = makeRepositoryWithAuthRequest(authorisedRequestStub)

      await repo.updateCompany(stubRequest, '999', {
        global_headquarters: '1',
      })

      expect(authorisedRequestStub).to.be.calledOnceWithExactly(stubRequest, {
        url: `${config.apiRoot}/v4/company/999`,
        method: 'PATCH',
        body: {
          global_headquarters: '1',
        },
      })
    })
  })

  describe('#getDitCompany', () => {
    it('should return company', async () => {
      nock(config.apiRoot)
        .get(`/v4/company/${companyV4Data.id}`)
        .reply(200, companyV4Data)

      const company = await getDitCompany(stubRequest, companyV4Data.id)

      expect(company).to.deep.equal(companyV4Data)
    })
  })

  describe('#getDitCompanyFromList', () => {
    it('should call the API with a GET to see if the company exists in the list', async () => {
      const authorisedRequestStub = sinon.stub()
      const repo = makeRepositoryWithAuthRequest(authorisedRequestStub)

      await repo.getDitCompanyFromList(stubRequest, myCompanyListData.id)

      expect(authorisedRequestStub).calledOnceWithExactly(stubRequest, {
        method: 'GET',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#addDitCompanyToList', () => {
    it('should call the API with a PUT to add company to the list', async () => {
      const authorisedRequestStub = sinon.stub()
      const repo = makeRepositoryWithAuthRequest(authorisedRequestStub)

      await repo.addDitCompanyToList(stubRequest, myCompanyListData.id)

      expect(authorisedRequestStub).calledOnceWithExactly(stubRequest, {
        method: 'PUT',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#removeDitCompanyToList', () => {
    it('should call the API with a DELETE to remove company from the list', async () => {
      const authorisedRequestStub = sinon.stub()
      const repo = makeRepositoryWithAuthRequest(authorisedRequestStub)

      await repo.removeDitCompanyFromList(stubRequest, myCompanyListData.id)

      expect(authorisedRequestStub).calledOnceWithExactly(stubRequest, {
        method: 'DELETE',
        url: `${config.apiRoot}/v4/user/company-list/${myCompanyListData.id}`,
      })
    })
  })

  describe('#saveDnbCompany', () => {
    it('should respond successfully', async () => {
      nock(config.apiRoot)
        .post('/v4/dnb/company-create', {
          duns_number: '123',
        })
        .reply(200, {
          hello: true,
        })

      const actual = await saveDnbCompany(stubRequest, '123')

      expect(actual).to.deep.equal({ hello: true })
    })
  })

  describe('#saveCompanyExportDetails', () => {
    it('should respond successfully', async () => {
      const companyId = companyV4Data.id
      const { exportCountries } = generateExportCountries()
      const details = {
        export_countries: exportCountries,
      }

      nock(config.apiRoot)
        .patch(`/v4/company/${companyId}/export-detail`, details)
        .reply(200, {
          countries: true,
        })

      const actual = await saveCompanyExportDetails(
        stubRequest,
        companyId,
        details
      )

      expect(actual).to.deep.equal({ countries: true })
    })
  })
})
