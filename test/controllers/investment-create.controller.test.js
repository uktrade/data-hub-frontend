const company = {
  id: '12345',
  name: 'Test company',
  uk_based: false,
  contacts: [{
    id: 1,
    first_name: 'Bob',
    last_name: 'Stevens'
  }]
}
const investmentProjects = {
  count: 0,
  results: []
}

describe('Investment start controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInflatedDitCompany = this.sandbox.stub().resolves(company)
    this.getCompanyInvestmentProjects = this.sandbox.stub().resolves(investmentProjects)
    this.saveInvestmentProject = this.sandbox.stub().resolves({})
    this.transformForApi = this.sandbox.stub().returns({})

    this.controller = proxyquire(`${root}/src/controllers/investment-create.controller`, {
      '../services/company.service': {
        getInflatedDitCompany: this.getInflatedDitCompany
      },
      '../repos/investment.repo': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjects,
        saveInvestmentProject: this.saveInvestmentProject
      },
      '../services/investment-formatting.service': {
        transformForApi: this.transformForApi
      },
      '../repos/metadata.repo': {
        investmentTypeOptions: [{ id: 1, name: 'FDI' }],
        referralSourceActivityOptions: [],
        businessActivityOptions: [],
        sectorOptions: []
      }
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getHandler', () => {
    describe('when no company ID is provided', () => {
      it('should redirect to the start', (done) => {
        this.controller.getHandler({
          session: {
            token: 'abcd'
          },
          query: {}
        }, {
          redirect: (url) => {
            expect(url).to.equal('/investment/start')
            done()
          }
        }, this.next)
      })
    })

    describe('when a the company exists', () => {
      it('should render company details', (done) => {
        this.controller.getHandler({
          session: {
            token: 'abcd'
          },
          query: {
            'equity-company': '12345'
          }
        }, {
          locals: {},
          render: (template, data) => {
            try {
              expect(this.getInflatedDitCompany).to.be.calledWith('abcd', '12345')
              expect(this.getCompanyInvestmentProjects).to.be.calledWith('abcd', '12345')

              expect(data).to.have.property('form')
              expect(data).to.have.property('equityCompany')
              expect(data).to.have.property('equityCompanyInvestments')

              expect(data.equityCompany).to.deep.equal(company)
              expect(data.equityCompanyInvestments).to.deep.equal(investmentProjects)

              expect(data.form).to.deep.equal({
                options: {
                  contacts: [{ id: 1, name: 'Bob Stevens' }],
                  investmentTypes: [{ value: 1, label: 'FDI' }],
                  referralSourceActivities: [],
                  businessActivities: [],
                  primarySectors: []
                }
              })

              done()
            } catch (e) {
              done(e)
            }
          }
        }, this.next)
      })
    })
  })

  describe('#postHandler', () => {
    describe('when save is resolved with an object', () => {
      beforeEach(() => {
        this.saveInvestmentProject = this.saveInvestmentProject.resolves({
          id: '12345'
        })
      })

      it('should redirect to the investment project', (done) => {
        this.controller.postHandler({
          session: {
            token: 'abcd'
          },
          body: {}
        }, {
          redirect: (url) => {
            try {
              expect(url).to.equal('/investment/12345')
              done()
            } catch (e) {
              done(e)
            }
          }
        }, this.next)
      })
    })

    describe('when save is rejected with a 400 code', () => {
      beforeEach(() => {
        this.saveInvestmentProject = this.saveInvestmentProject.rejects({
          statusCode: 400,
          error: {
            foo: 'field must not be empty'
          }
        })
      })

      it('should set the error to locals and continue', (done) => {
        const req = {
          session: {
            token: 'abcd'
          },
          body: {
            foo: 'bar'
          }
        }
        const res = { locals: {} }
        const next = function () {
          try {
            expect(res.locals).to.deep.equal({
              form: {
                errors: {
                  foo: 'field must not be empty'
                },
                state: {
                  foo: 'bar'
                }
              }
            })
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.postHandler(req, res, next)
      })
    })

    describe('when save is rejected with an error', () => {
      beforeEach(() => {
        this.saveInvestmentProject = this.saveInvestmentProject.rejects(new Error())
      })

      it('should set the error to locals and continue', (done) => {
        const req = { session: { token: 'abcd' } }
        const res = {}
        const next = function (err) {
          try {
            expect(err).to.be.an('error')
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.postHandler(req, res, next)
      })
    })
  })
})
