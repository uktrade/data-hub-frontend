/* eslint prefer-promise-reject-errors: 0 */
const companyData = require('~/test/unit/data/company.json')
const companyV4Data = require('~/test/unit/data/companies/company-v4.json')

const config = require('~/config')

const { getDitCompany } = require('~/src/apps/companies/repos.js')

describe('Company repository', () => {
  describe('Save company', () => {
    describe('Make correct call to API', () => {
      it('should call the API with a PATCH if an ID is provided.', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.method).to.eq('PATCH')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API at /v4/company/id if an ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/v4/company/1234')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { id: '1234', name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API with a POST if no ID is provided.', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.method).to.eq('POST')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
      it('should call the API at /v4/company if no ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/v4/company')
          return new Promise((resolve) => {
            resolve({ id: '1234', name: 'fred' })
          })
        }
        const companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)

        companyRepository.saveCompany('1234', { name: 'fred' })
          .then(() => {
            done()
          })
          .catch((error) => {
            throw Error(error)
          })
      })
    })
  })

  describe('Update company', () => {
    beforeEach(() => {
      this.authorisedRequestStub = sinon.stub().resolves(companyData)
      this.repo = proxyquire('~/src/apps/companies/repos', {
        '../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
        '../../../config': {
          apiRoot: 'http://test.com',
        },
      })
    })

    it('should make the correct call to the API', () => {
      return this.repo.updateCompany('1234', '999', { global_headquarters: '1' })
        .then(() => {
          expect(this.authorisedRequestStub).to.be.calledWith('1234', {
            url: 'http://test.com/v4/company/999',
            method: 'PATCH',
            body: {
              global_headquarters: '1',
            },
          })
        })
    })
  })

  describe('#getDitCompany', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v4/company/${companyV4Data.id}`)
        .reply(200, companyV4Data)

      this.company = await getDitCompany('1234', companyV4Data.id)
    })

    it('should return', () => {
      expect(this.company).to.deep.equal({
        ...companyV4Data,
        registered_address_1: '82 Ramsgate Rd',
        registered_address_2: '',
        registered_address_town: 'Willington',
        registered_address_county: '',
        registered_address_postcode: 'NE28 5JB',
        registered_address_country: {
          name: 'United Kingdom',
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
        trading_address_1: '82 Ramsgate Rd',
        trading_address_2: '',
        trading_address_town: 'Willington',
        trading_address_county: '',
        trading_address_postcode: 'NE28 5JB',
        trading_address_country: {
          name: 'United Kingdom',
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
      })
    })
  })

  function makeRepositoryWithAuthRequest (authorisedRequestStub) {
    return proxyquire('~/src/apps/companies/repos', {
      '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
    })
  }
})
