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
const investmentProjectSummary = {
  id: '12345',
  investor_company: '67890',
  estimated_land_date: '2018-10-01',
  client_relationship_manager: '111222',
  referral_source_advisor: '333444',
}
const advisorMock = {
  results: [
    {
      id: 1,
      first_name: 'Jeff',
      last_name: 'Major',
    }
  ]
}

describe('Investment create controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInflatedDitCompany = this.sandbox.stub().resolves(company)
    this.getCompanyInvestmentProjects = this.sandbox.stub().resolves(investmentProjects)
    this.getInvestmentProjectSummary = this.sandbox.stub().resolves(investmentProjectSummary)
    this.getAdvisors = this.sandbox.stub().resolves(advisorMock)
    this.createInvestmentProject = this.sandbox.stub().resolves({})
    this.updateInvestmentProject = this.sandbox.stub().resolves({})
    this.transformToApi = this.sandbox.stub().returns({})
    this.transformFromApi = this.sandbox.stub().returns(investmentProjectSummary)

    this.controller = proxyquire('~/src/controllers/investment-create.controller', {
      '../services/company.service': {
        getInflatedDitCompany: this.getInflatedDitCompany
      },
      '../repos/investment.repo': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjects,
        getInvestmentProjectSummary: this.getInvestmentProjectSummary,
        createInvestmentProject: this.createInvestmentProject,
        updateInvestmentProject: this.updateInvestmentProject
      },
      '../services/investment-formatting.service': {
        transformToApi: this.transformToApi,
        transformFromApi: this.transformFromApi
      },
      '../repos/advisor.repo': {
        getAdvisors: this.getAdvisors
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
          },
          locals: {}
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
                  advisors: [{ id: 1, name: 'Jeff Major' }],
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
        this.createInvestmentProject = this.createInvestmentProject.resolves({
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
              expect(this.updateInvestmentProject).not.to.be.called
              expect(this.createInvestmentProject).to.be.calledWith('abcd', {})
              expect(url).to.equal('/investment/12345')
              done()
            } catch (e) {
              done(e)
            }
          },
          locals: {}
        }, this.next)
      })
    })

    describe('when project id is set', () => {
      beforeEach(() => {
        this.updateInvestmentProject = this.updateInvestmentProject.resolves({
          id: '5678'
        })
      })

      it('should call the edit method', (done) => {
        this.controller.postHandler({
          session: {
            token: 'abcd'
          },
          body: {}
        }, {
          locals: {
            projectId: '5678'
          },
          redirect: (url) => {
            try {
              expect(this.createInvestmentProject).not.to.be.called
              expect(this.updateInvestmentProject).to.be.calledWith('abcd', '5678', {})
              expect(url).to.equal('/investment/5678')
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
        this.createInvestmentProject = this.createInvestmentProject.rejects({
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
        this.createInvestmentProject = this.createInvestmentProject.rejects(new Error())
      })

      it('should set the error to locals and continue', (done) => {
        const req = { session: { token: 'abcd' } }
        const res = { locals: {} }
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

  describe('#editMiddleware', () => {
    describe('when project is resolved', () => {
      it('should set project data on locals', (done) => {
        const req = {
          session: {
            token: 'abcd',
            user: {
              id: '1a2b3c4d5e'
            }
          },
          params: {
            id: '12345'
          }
        }
        const res = { locals: {} }
        const next = function () {
          try {
            expect(res.locals).to.deep.equal({
              projectId: '12345',
              equityCompanyId: '67890',
              form: {
                state: {
                  id: '12345',
                  investor_company: '67890',
                  estimated_land_date: '2018-10-01',
                  client_relationship_manager: '111222',
                  referral_source_advisor: '333444',
                  'is-relationship-manager': 'No',
                  'is-referral-source': 'No',
                }
              }
            })
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.editMiddleware(req, res, next)
      })
    })

    describe('when user id matches values for relationship manager and advisor', () => {
      beforeEach(() => {
        const summaryMock = {
          id: '12345',
          investor_company: '67890',
          estimated_land_date: '2018-10-01',
          client_relationship_manager: '1a2b3c4d5e',
          referral_source_advisor: '1a2b3c4d5e',
        }

        this.getInvestmentProjectSummary.resolves(summaryMock)
        this.transformFromApi.returns(summaryMock)
      })

      it('should set project data on locals', (done) => {
        const req = {
          session: {
            token: 'abcd',
            user: {
              id: '1a2b3c4d5e'
            }
          },
          params: {
            id: '12345'
          }
        }
        const res = { locals: {} }
        const next = function () {
          try {
            expect(res.locals).to.deep.equal({
              projectId: '12345',
              equityCompanyId: '67890',
              form: {
                state: {
                  id: '12345',
                  investor_company: '67890',
                  estimated_land_date: '2018-10-01',
                  client_relationship_manager: '1a2b3c4d5e',
                  referral_source_advisor: '1a2b3c4d5e',
                  'is-relationship-manager': '1a2b3c4d5e',
                  'is-referral-source': '1a2b3c4d5e',
                }
              }
            })
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.editMiddleware(req, res, next)
      })
    })

    describe('when save is rejected with an error', () => {
      beforeEach(() => {
        this.getInvestmentProjectSummary = this.getInvestmentProjectSummary.rejects(new Error())
      })

      it('should set the error to locals and continue', (done) => {
        const req = {
          session: {
            token: 'abcd'
          },
          params: {
            id: '12345'
          }
        }
        const res = {}
        const next = function (err) {
          try {
            expect(err).to.be.an('error')
            done()
          } catch (e) {
            done(e)
          }
        }

        this.controller.editMiddleware(req, res, next)
      })
    })
  })
})
