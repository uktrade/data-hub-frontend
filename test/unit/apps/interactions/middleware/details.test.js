const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const interactionData = require('~/test/unit/data/interactions/new-interaction.json')

describe('Interaction details middleware', () => {
  describe('#postDetails', () => {
    context('when all fields are valid', () => {
      context('when creating a new interaction', () => {
        beforeEach(async () => {
          this.saveInteractionStub = sinon.stub()

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
          })

          const middleware = proxyquire('~/src/apps/interactions/middleware/details', {
            '../repos': {
              saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
            },
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        it('should POST to the API', () => {
          expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
            this.middlewareParameters.reqMock.session.token,
            {
              contact: '4c748e6e-05f4-478c-b07f-3d2e2290eb03',
              contacts: [],
              date: '2017-10-03',
              dit_adviser: '4ae885a0-6db4-4929-848d-ef9c84d5a085',
              dit_participants: [],
              dit_team: 'cff02898-9698-e211-a939-e4115bead28a',
              grant_amount_offered: null,
              net_company_receipt: null,
              notes: 'notes',
              policy_areas: [],
              policy_issue_types: [],
              service: '1783ae93-b78f-e611-8c55-e4115bed50dc',
              subject: 'subject',
            }
          )
        })

        it('should flash a created message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.be.calledOnceWithExactly('success', 'Interaction created')
        })

        it('should redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.be.calledOnceWithExactly('/return/1')
        })
      })

      context('when updating an existing interaction', () => {
        beforeEach(async () => {
          this.saveInteractionStub = sinon.stub()

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
            interaction: {
              ...interactionData,
            },
          })

          const middleware = proxyquire('~/src/apps/interactions/middleware/details', {
            '../repos': {
              saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
            },
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        it('should PATCH to the API', () => {
          expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
            this.middlewareParameters.reqMock.session.token,
            {
              contact: '4c748e6e-05f4-478c-b07f-3d2e2290eb03',
              contacts: [],
              date: '2017-10-03',
              dit_adviser: '4ae885a0-6db4-4929-848d-ef9c84d5a085',
              dit_participants: [],
              dit_team: 'cff02898-9698-e211-a939-e4115bead28a',
              grant_amount_offered: null,
              net_company_receipt: null,
              notes: 'notes',
              policy_areas: [],
              policy_issue_types: [],
              service: '1783ae93-b78f-e611-8c55-e4115bed50dc',
              subject: 'subject',
            }
          )
        })

        it('should flash an updated message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.be.calledOnceWithExactly('success', 'Interaction updated')
        })

        it('should redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.be.calledOnceWithExactly('/return/1')
        })
      })
    })

    context('when there are server errors', () => {
      context('when the error is 400', () => {
        beforeEach(async () => {
          this.saveInteractionStub = sinon.stub()

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
          })

          const middleware = proxyquire('~/src/apps/interactions/middleware/details', {
            '../repos': {
              saveInteraction: this.saveInteractionStub.rejects({ statusCode: 400, error: 'error' }),
            },
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        it('should not flash a message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.not.be.called
        })

        it('should not redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.not.be.called
        })

        it('should set errors on locals', () => {
          expect(this.middlewareParameters.resMock.locals.form).to.deep.equal({
            errors: {
              messages: 'error',
            },
          })
        })

        it('should call next without errors', () => {
          expect(this.middlewareParameters.nextSpy).have.been.calledOnceWithExactly()
        })
      })

      context('when the error is 500', () => {
        beforeEach(async () => {
          this.saveInteractionStub = sinon.stub()

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
          })

          const middleware = proxyquire('~/src/apps/interactions/middleware/details', {
            '../repos': {
              saveInteraction: this.saveInteractionStub.rejects({ statusCode: 500, error: 'error' }),
            },
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        it('should not flash a message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.not.be.called
        })

        it('should not redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.not.be.called
        })

        it('should not set errors on locals', () => {
          expect(this.middlewareParameters.resMock.locals.form).to.not.exist
        })

        it('should call next with errors', () => {
          expect(this.middlewareParameters.nextSpy).have.been.calledOnceWithExactly({
            error: 'error',
            statusCode: 500,
          })
        })
      })
    })
  })

  describe('#getInteractionDetails', () => {
    beforeEach(() => {
      this.fetchInteractionStub = sinon.stub()
      this.getContactStub = sinon.stub()
      this.getDitCompanyStub = sinon.stub()

      this.middleware = proxyquire('~/src/apps/interactions/middleware/details', {
        '../repos': {
          fetchInteraction: this.fetchInteractionStub.resolves(interactionData),
        },
        '../../adviser/filters': {
          filterActiveAdvisers: this.filterActiveAdvisersSpy,
        },
        '../../contacts/repos': {
          getContact: this.getContactStub,
        },
        '../../companies/repos': {
          getDitCompany: this.getDitCompanyStub,
        },
      })

      this.middlewareParameters = buildMiddlewareParameters({
        requestBody: { ...interactionData },
        requestParams: {
          kind: 'interaction',
        },
        interactions: {
          returnLink: '/return/',
        },
      })
    })

    context('when provided an interaction with a company associated', () => {
      beforeEach(async () => {
        this.company = sinon.mock()
        this.interaction = {
          ...interactionData,
          company: this.company,
        }
        this.fetchInteractionStub.resolves(this.interaction)

        await this.middleware.getInteractionDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
          '1'
        )
      })

      it('should set interaction data on locals', () => {
        expect(this.middlewareParameters.resMock.locals.interaction).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction', () => {
        expect(this.middlewareParameters.resMock.locals.company).to.deep.equal(this.company)
      })
    })

    context('when provided an investment interaction with no company', () => {
      beforeEach(async () => {
        this.interaction = {
          ...interactionData,
          company: null,
          contact: {
            id: '4444',
          },
        }

        this.fetchInteractionStub.resolves(this.interaction)

        this.getContactStub.resolves({
          company: {
            id: '1234',
          },
        })

        this.company = sinon.mock()
        this.getDitCompanyStub.resolves(this.company)

        await this.middleware.getInteractionDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
          '1'
        )
      })

      it('should set interaction data on locals', () => {
        expect(this.middlewareParameters.resMock.locals.interaction).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction contact', () => {
        expect(this.middlewareParameters.resMock.locals.company).to.deep.equal(this.company)
      })
    })
  })
})
