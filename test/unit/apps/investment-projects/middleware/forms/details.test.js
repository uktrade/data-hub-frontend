const uuid = require('uuid')
const { assign } = require('lodash')
const nock = require('nock')

const config = require('~/config')
const metadata = require('~/src/lib/metadata')
const companyData = require('~/test/unit/data/companies/company.json')

describe('investment details middleware', () => {
  beforeEach(() => {
    this.next = sandbox.stub()

    this.updateInvestmentStub = sandbox.stub().resolves({ id: '999' })
    this.createInvestmentStub = sandbox.stub().resolves({ id: '888' })
    this.getEquityCompanyDetailsStub = sandbox.stub().resolves(companyData)

    this.req = {
      session: {
        token: uuid(),
        user: {
          id: '4321',
          name: 'Julie Brown',
        },
      },
      body: {},
      params: {},
      query: {},
    }

    this.res = {
      locals: {
        form: {},
      },
      redirect: sandbox.stub(),
    }

    this.detailsMiddleware = proxyquire('~/src/apps/investment-projects/middleware/forms/details', {
      '../../repos': {
        updateInvestment: this.updateInvestmentStub,
        createInvestmentProject: this.createInvestmentStub,
        getEquityCompanyDetails: this.getEquityCompanyDetailsStub,
      },
      '../../../../lib/metadata': assign({}, metadata, {
        investmentTypeOptions: [],
        referralSourceActivityOptions: [],
        fdiOptions: [],
        referralSourceMarketingOptions: [],
        referralSourceWebsiteOptions: [],
        sectorOptions: [],
        businessActivityOptions: [],
        investmentSpecificProgrammeOptions: [],
        investmentInvestorTypeOptions: [],
        investmentInvolvementOptions: [],
      }),
    })
  })

  describe('#handleFormPost', () => {
    context('when saving a new investment project', () => {
      beforeEach(async () => {
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should create a new investment', () => {
        expect(this.createInvestmentStub).to.be.calledOnce
      })
    })

    context('when editing an existing investment project', () => {
      beforeEach(async () => {
        this.req.params.investmentId = '777'
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should create a new investment', () => {
        expect(this.updateInvestmentStub).to.be.calledOnce
      })
    })

    context('when saving the form raises no errors', () => {
      beforeEach(async () => {
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should call next', () => {
        expect(this.next).to.be.called
      })
    })

    context('when saving form raises an error', () => {
      beforeEach(async () => {
        this.err = {
          statusCode: 400,
          error: {},
        }

        this.createInvestmentStub.rejects(this.err)
      })

      context('and a single contact and business activity are provided', () => {
        beforeEach(async () => {
          this.req.body = {
            client_contacts: '1234',
            business_activities: '4321',
          }

          await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
        })

        it('should return contacts to the form as an array', () => {
          expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234'])
        })

        it('should return activities to the form as an array', () => {
          expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321'])
        })
      })

      context('and multiple contacts and business activities are provided', () => {
        beforeEach(async () => {
          this.req.body = {
            client_contacts: ['1234', '5678'],
            business_activities: ['4321', '8765'],
          }

          await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
        })

        it('should return contacts to the form as an array', () => {
          expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234', '5678'])
        })

        it('should return activities to the form as an array', () => {
          expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321', '8765'])
        })
      })
    })

    context('the user select add another contact', () => {
      beforeEach(async () => {
        this.req.body = {
          client_contacts: ['1234', '5678'],
          business_activities: ['4321', '8765'],
          'add-item': 'client_contacts',
        }

        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should not save the data', () => {
        expect(this.updateInvestmentStub).to.not.be.called
      })

      it('should return a form state with an additional empty contact', () => {
        expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234', '5678', ''])
      })
    })

    context('the user select add another business activity', () => {
      beforeEach(async () => {
        this.req.body = {
          client_contacts: ['1234', '5678'],
          business_activities: ['4321', '8765'],
          'add-item': 'business_activities',
        }

        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should not save the data', () => {
        expect(this.updateInvestmentStub).to.not.be.called
      })

      it('should return a form state with an additional empty contact', () => {
        expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321', '8765', ''])
      })
    })
  })

  describe('#populateForm', () => {
    beforeEach(() => {
      this.advisersData = {
        count: 5,
        results: [
          { id: '1', name: 'Jeff Smith', is_active: true },
          { id: '2', name: 'John Smith', is_active: true },
          { id: '3', name: 'Zac Smith', is_active: true },
          { id: '4', name: 'Fred Smith', is_active: false },
          { id: '5', name: 'Jim Smith', is_active: false },
        ],
      }
    })

    context('when adding a new project', () => {
      beforeEach(async () => {
        this.nockScope = nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, this.advisersData)

        this.req.params = assign({}, this.req.params, { equityCompanyId: uuid() })
        await this.detailsMiddleware.populateForm(this.req, this.res, this.next)
      })

      it('includes all active adviser options for client relationship manager', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        expect(this.res.locals.form.options.clientRelationshipManagers).to.deep.equal(expectedOptions)
      })

      it('includes all active adviser options for referral source adviser', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        expect(this.res.locals.form.options.referralSourceAdvisers).to.deep.equal(expectedOptions)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when editing a project with an inactive adviser', () => {
      beforeEach(async () => {
        this.req.params = assign({}, this.req.params, { equityCompanyId: uuid() })

        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, this.advisersData)
          .get(`/v3/company/${this.req.params.equityCompanyId}`)
          .reply(200, companyData)
          .get(`/v3/investment?investor_company_id=${this.req.params.equityCompanyId}&limit=10&offset=0`)
          .reply(200, { count: 0, results: [] })

        this.res.locals = assign({}, this.res.locals, {
          investmentData: {
            id: uuid(),
            client_relationship_manager: {
              id: '4',
              name: 'Fred Smith',
            },
            referral_source_adviser: {
              id: '5',
              name: 'Jim Smith',
            },
          },
        })

        await this.detailsMiddleware.populateForm(this.req, this.res, this.next)
      })

      it('includes all active adviser options for client relationship manager', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Fred Smith', value: '4' },
        ]

        expect(this.res.locals.form.options.clientRelationshipManagers).to.deep.equal(expectedOptions)
      })

      it('includes all active adviser options for referral source adviser', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Jim Smith', value: '5' },
        ]

        expect(this.res.locals.form.options.referralSourceAdvisers).to.deep.equal(expectedOptions)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })
})
