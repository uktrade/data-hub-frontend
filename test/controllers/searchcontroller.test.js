/* globals expect: true, describe: true, it: true, beforeEach: true, sinon: true */
const proxyquire = require('proxyquire')
const next = function (error) {
  throw Error(error)
}

describe('Search controller', function () {
  describe('view company result', function () {
    it('should route a ch result', function (done) {
      const searchController = proxyquire('../../src/controllers/searchcontroller', {
        '../repositorys/companyrepository': {
          getDitCompany: sinon.stub().resolves(null)
        }
      })
      const req = {
        session: { token: '1234' },
        params: {
          source: 'company_companieshousecompany',
          id: '9999'
        }
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/ch/9999')
          done()
        }
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk private ltd company', function (done) {
      const searchController = proxyquire('../../src/controllers/searchcontroller', {
        '../repositorys/companyrepository': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Private limited company',
              selectable: true
            }
          })
        }
      })
      const req = {
        session: { token: '1234' },
        params: {
          source: 'company_company',
          id: '9999'
        }
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/ltd/9999')
          done()
        }
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public ltd company', function (done) {
      const searchController = proxyquire('../../src/controllers/searchcontroller', {
        '../repositorys/companyrepository': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Public limited company',
              selectable: true
            }
          })
        }
      })
      const req = {
        session: { token: '1234' },
        params: {
          source: 'company_company',
          id: '9999'
        }
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/ltd/9999')
          done()
        }
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public other company', function (done) {
      const searchController = proxyquire('../../src/controllers/searchcontroller', {
        '../repositorys/companyrepository': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Partnership',
              selectable: true
            }
          })
        }
      })
      const req = {
        session: { token: '1234' },
        params: {
          source: 'company_company',
          id: '9999'
        }
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/ukother/9999')
          done()
        }
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a foreign company', function (done) {
      const searchController = proxyquire('../../src/controllers/searchcontroller', {
        '../repositorys/companyrepository': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: false,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Company',
              selectable: true
            }
          })
        }
      })
      const req = {
        session: { token: '1234' },
        params: {
          source: 'company_company',
          id: '9999'
        }
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/foreign/9999')
          done()
        }
      }
      searchController.viewCompanyResult(req, res, next)
    })
  })
})
