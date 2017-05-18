/* eslint prefer-promise-reject-errors: 0 */
require('babel-polyfill')

describe('Company repository', () => {
  describe('Save company', () => {
    describe('Handle response from server', () => {
      describe('Successfully save a company', () => {
        let companyRepository
        const authorisedRequestStub = function () {
          return new Promise((resolve) => {
            resolve({
              id: '1234',
              name: 'fred'
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return data if successful', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then((data) => {
              expect(data.id).to.equal('1234')
              done()
            })
            .catch(() => {
              fail()
            })
        })
      })
      describe('Save a company and get a 400', () => {
        let companyRepository
        const authorisedRequestStub = function () {
          return new Promise((resolve, reject) => {
            reject({
              error: {
                sector: ['error with sector']
              },
              message: '400 - {"sector":["error with sector"]}',
              name: 'StatusCodeError',
              response: {
                statusCode: 400,
                statusMessage: 'Bad Request'
              }
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(400)
              done()
            })
        })
        it('should show that there was an error with a field', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.errors).to.eql({
                sector: ['error with sector']
              })
              done()
            })
        })
      })
      describe('Save a company and get a formatted 500', () => {
        let companyRepository
        const authorisedRequestStub = function () {
          return new Promise((resolve, reject) => {
            reject({
              error: {'detail': 'Service Unavailable'},
              name: 'StatusCodeError',
              response: {
                statusCode: 501
              }
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(501)
              expect(error.errors).to.eql({ detail: 'Service Unavailable' })
              done()
            })
        })
      })
      describe('Save a company and get a generic 500', () => {
        let companyRepository
        const authorisedRequestStub = function () {
          return new Promise((resolve, reject) => {
            reject({
              error: 'Service Unavailable',
              message: '503 "Service Unavailable"',
              name: 'StatusCodeError',
              response: {
                statusCode: 501,
                statusMessage: 'Service Unavailable'
              }
            })
          })
        }

        beforeEach(() => {
          companyRepository = makeRepositoryWithAuthRequest(authorisedRequestStub)
        })
        it('should return an error and a formatted error response', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error).to.have.property('statusCode')
              expect(error).to.have.property('errors')
              done()
            })
        })
        it('should indicate the error code', (done) => {
          companyRepository.saveCompany('1234', {id: '1234', name: 'fred'})
            .then(() => {
              fail()
            })
            .catch((error) => {
              expect(error.statusCode).to.equal(501)
              expect(error.errors).to.eql({ detail: 'Service Unavailable' })
              done()
            })
        })
      })
    })
    describe('Make correct call to API', () => {
      it('should call the API with a PUT if an ID is provided.', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.method).to.eq('PUT')
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
      it('should call the API at /company/id/ if an ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/company/1234/')
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
      it('should call the API at /company/ if no ID is provided', (done) => {
        const authorisedRequestStub = function (token, opts) {
          expect(opts.url).to.include('/company/')
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

  function makeRepositoryWithAuthRequest (authorisedRequestStub) {
    return proxyquire(`${root}/src/repos/company.repo`, {
      '../lib/authorised-request': authorisedRequestStub
    })
  }

  function fail () {
    expect(true).to.eq(false)
  }
})
