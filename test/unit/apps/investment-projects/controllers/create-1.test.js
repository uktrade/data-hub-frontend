const token = 'abcd'
const ukCompany = {
  id: '12345',
  name: 'Test company',
  uk_based: true,
}
const foreignCompany = {
  id: '12345',
  name: 'Test company',
  uk_based: false,
}
const investmentProjects = {
  count: 0,
  results: [],
}
const searchResults = {
  count: 0,
  results: [],
}

describe('Investment start controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInflatedDitCompany = this.sandbox.stub().resolves(ukCompany)
    this.getCompanyInvestmentProjects = this.sandbox.stub().resolves(investmentProjects)
    this.searchForeignCompanies = this.sandbox.stub().resolves(searchResults)
    this.buildPagination = this.sandbox.stub().returns(null)
    this.breadcrumbStub = function () { return this }

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/create-1', {
      '../../companies/services/data': {
        getInflatedDitCompany: this.getInflatedDitCompany,
      },
      '../repos': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjects,
      },
      '../../search/services': {
        searchForeignCompanies: this.searchForeignCompanies,
      },
      '../../../lib/pagination': {
        buildPagination: this.buildPagination,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getHandler', () => {
    describe('when no company ID is present', () => {
      it('should render company details and search', (done) => {
        this.controller.getHandler({
          session: {
            token,
          },
          query: {},
        }, {
          locals: {},
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(data.clientCompany).to.be.undefined
              expect(data.clientCompanyInvestments).to.be.undefined
              expect(data.showSearch).to.equal(false)
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when a UK client company exists', () => {
      it('should render company details and search', (done) => {
        this.controller.getHandler({
          session: {
            token,
          },
          query: {
            'client-company': '12345',
          },
        }, {
          locals: {},
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(this.getInflatedDitCompany).to.be.calledWith(token, '12345')
              expect(this.getCompanyInvestmentProjects).to.be.calledWith(token, '12345')

              expect(data.clientCompany).to.deep.equal(ukCompany)
              expect(data.clientCompanyInvestments).to.deep.equal(investmentProjects)
              expect(data.showSearch).to.equal(true)
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when a foreign client company exists', () => {
      beforeEach(() => {
        this.getInflatedDitCompany = this.getInflatedDitCompany.resolves(foreignCompany)
      })

      it('should render company details and no search', (done) => {
        this.controller.getHandler({
          session: {
            token,
          },
          query: {
            'client-company': '12345',
          },
        }, {
          locals: {},
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(this.getInflatedDitCompany).to.be.calledWith(token, '12345')
              expect(this.getCompanyInvestmentProjects).to.be.calledWith(token, '12345')

              expect(data.clientCompany).to.deep.equal(foreignCompany)
              expect(data.clientCompanyInvestments).to.deep.equal(investmentProjects)
              expect(data.showSearch).to.equal(false)
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })

      it('should render search', (done) => {
        this.controller.getHandler({
          session: {
            token,
          },
          query: {
            'client-company': '12345',
            'show-search': true,
          },
        }, {
          locals: {},
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(data.showSearch).to.equal(true)
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })

    describe('when query contains a search term', () => {
      it('should render results', (done) => {
        this.controller.getHandler({
          session: {
            token,
          },
          query: {
            'client-company': '12345',
            'q': 'samsung',
          },
        }, {
          locals: {},
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(data.searchTerm).to.equal('samsung')
              expect(data.searchResult).to.deep.equal(searchResults)
              expect(data.searchResult.pagination).to.be.null
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })
  })

  describe('#postHandler', () => {
    describe('when client company is the equity source', () => {
      it('should redirect to the create step', (done) => {
        this.controller.postHandler({
          body: {
            'client-company': '12345',
            'is-equity-source': 'true',
          },
        }, {
          redirect: (path) => {
            expect(path).to.equal('2?equity-company=12345')
            done()
          },
        }, this.next)
      })
    })

    describe('when client company is not the equity source', () => {
      it('should redirect to the start step with search param', (done) => {
        this.controller.postHandler({
          body: {
            'client-company': '12345',
            'is-equity-source': 'false',
          },
        }, {
          redirect: (path) => {
            expect(path).to.equal('1?client-company=12345&show-search=true')
            done()
          },
        }, this.next)
      })
    })

    describe('when no value is given for equity source', () => {
      it('should redirect to the create step', (done) => {
        this.controller.postHandler({
          session: {
            token,
          },
          body: {
            'client-company': '12345',
          },
        }, {
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(data.clientCompany).to.deep.equal(ukCompany)
              expect(data.errors).to.have.property('isEquitySource')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.next)
      })
    })
  })
})
