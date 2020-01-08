const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const interactionData = require('../../../../../test/unit/data/interactions/new-interaction')
const interactionDataWithCountries = require('../../../../../test/unit/data/interactions/new-interaction-with-countries')
const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data')

const { EXPORT_INTEREST_STATUS } = require('../../../constants')

const { transformServicesOptions } = require('../../transformers')

const modulePath = '../details'
const { FUTURE_INTEREST, EXPORTING_TO, NOT_INTERESTED } = EXPORT_INTEREST_STATUS

const serviceOptionsTransformed = transformServicesOptions(serviceOptions)

describe('Interaction details middleware', () => {
  describe('#postDetails', () => {
    context('when all fields are valid', () => {
      context('when the interaction-add-countries is false', () => {
        context('when creating a new interaction', () => {
          before(async () => {
            this.saveInteractionStub = sinon.stub()
            this.getServiceOptionsStub = sinon.stub()

            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: { ...interactionData },
              requestParams: {
                kind: 'interaction',
              },
              interactions: {
                returnLink: '/return/',
              },
            })

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../../../lib/options': {
                getOptions: this.getServiceOptionsStub.resolves(
                  serviceOptionsTransformed
                ),
              },
            })

            await middleware.postDetails(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
          })

          it('should POST to the API', () => {
            expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
              this.middlewareParameters.reqMock.session.token,
              {
                contact: '4c748e6e-05f4-478c-b07f-3d2e2290eb03',
                dit_team: 'cff02898-9698-e211-a939-e4115bead28a',
                service: 'Providing Export Advice & Information',
                subService: ['Providing Export Advice & Information'],
                'sv2-q1': 'sv2-a1',
                subject: 'subject',
                notes: 'notes',
                dit_adviser: '4ae885a0-6db4-4929-848d-ef9c84d5a085',
                service_answers: { 'sv2-q1': { 'sv2-a1': {} } },
                date: '2017-10-03',
                grant_amount_offered: null,
                net_company_receipt: null,
                contacts: [],
                dit_participants: [],
                policy_areas: [],
                policy_issue_types: [],
                status: 'complete',
              }
            )
          })

          it('should flash a created message', () => {
            expect(
              this.middlewareParameters.reqMock.flash
            ).to.be.calledOnceWithExactly('success', 'Interaction created')
          })

          it('should redirect', () => {
            expect(
              this.middlewareParameters.resMock.redirect
            ).to.be.calledOnceWithExactly('/return/1')
          })
        })

        context('when updating an existing interaction', () => {
          before(async () => {
            this.saveInteractionStub = sinon.stub()
            this.getServiceOptionsStub = sinon.stub()

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

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../../../lib/options': {
                getOptions: this.getServiceOptionsStub.resolves(
                  serviceOptionsTransformed
                ),
              },
            })

            await middleware.postDetails(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
          })

          it('should PATCH to the API', () => {
            expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
              this.middlewareParameters.reqMock.session.token,
              {
                contact: '4c748e6e-05f4-478c-b07f-3d2e2290eb03',
                dit_team: 'cff02898-9698-e211-a939-e4115bead28a',
                service: 'Providing Export Advice & Information',
                subService: ['Providing Export Advice & Information'],
                'sv2-q1': 'sv2-a1',
                subject: 'subject',
                notes: 'notes',
                dit_adviser: '4ae885a0-6db4-4929-848d-ef9c84d5a085',
                service_answers: { 'sv2-q1': { 'sv2-a1': {} } },
                date: '2017-10-03',
                grant_amount_offered: null,
                net_company_receipt: null,
                contacts: [],
                dit_participants: [],
                policy_areas: [],
                policy_issue_types: [],
                status: 'complete',
              }
            )
          })

          it('should flash an updated message', () => {
            expect(
              this.middlewareParameters.reqMock.flash
            ).to.be.calledOnceWithExactly('success', 'Interaction updated')
          })

          it('should redirect', () => {
            expect(
              this.middlewareParameters.resMock.redirect
            ).to.be.calledOnceWithExactly('/return/1')
          })
        })
      })

      context('when the interaction-add-countries is true', () => {
        context('when creating a new interaction', () => {
          before(async () => {
            this.saveInteractionStub = sinon.stub()
            this.getServiceOptionsStub = sinon.stub()

            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: { ...interactionDataWithCountries },
              requestParams: {
                theme: 'export',
                kind: 'interaction',
              },
              interactions: {
                returnLink: '/return/',
              },
              features: { 'interaction-add-countries': true },
            })
            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../../../lib/options': {
                getOptions: this.getServiceOptionsStub.resolves(
                  serviceOptionsTransformed
                ),
              },
            })

            await middleware.postDetails(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
          })

          it('should POST to the API', () => {
            expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
              this.middlewareParameters.reqMock.session.token,
              {
                contact: interactionDataWithCountries.contact,
                dit_team: interactionDataWithCountries.dit_team,
                service: 'Providing Export Advice & Information',
                subService: ['Providing Export Advice & Information'],
                'sv2-q1': 'sv2-a1',
                subject: 'subject',
                notes: 'notes',
                dit_adviser: interactionDataWithCountries.dit_adviser,
                service_answers: { 'sv2-q1': { 'sv2-a1': {} } },
                date: '2017-10-03',
                grant_amount_offered: null,
                net_company_receipt: null,
                contacts: [],
                dit_participants: [],
                policy_areas: [],
                policy_issue_types: [],
                status: 'complete',
                were_countries_discussed: 'true',
                [FUTURE_INTEREST]:
                  interactionDataWithCountries[FUTURE_INTEREST],
                [EXPORTING_TO]: interactionDataWithCountries[EXPORTING_TO],
                [NOT_INTERESTED]: interactionDataWithCountries[NOT_INTERESTED],
                export_countries: [
                  {
                    country: {
                      id: interactionDataWithCountries[FUTURE_INTEREST],
                    },
                    status: FUTURE_INTEREST,
                  },
                  {
                    country: { id: interactionDataWithCountries[EXPORTING_TO] },
                    status: EXPORTING_TO,
                  },
                  {
                    country: {
                      id: interactionDataWithCountries[NOT_INTERESTED],
                    },
                    status: NOT_INTERESTED,
                  },
                ],
              }
            )
          })

          it('should flash a created message', () => {
            expect(
              this.middlewareParameters.reqMock.flash
            ).to.be.calledOnceWithExactly('success', 'Interaction created')
          })

          it('should redirect', () => {
            expect(
              this.middlewareParameters.resMock.redirect
            ).to.be.calledOnceWithExactly('/return/1')
          })
        })

        context('when updating an existing interaction', () => {
          before(async () => {
            this.saveInteractionStub = sinon.stub()
            this.getServiceOptionsStub = sinon.stub()

            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: { ...interactionDataWithCountries },
              requestParams: {
                kind: 'interaction',
              },
              interactions: {
                returnLink: '/return/',
              },
              interaction: {
                ...interactionDataWithCountries,
              },
              features: { 'interaction-add-countries': true },
            })

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../../../lib/options': {
                getOptions: this.getServiceOptionsStub.resolves(
                  serviceOptionsTransformed
                ),
              },
            })

            await middleware.postDetails(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
          })

          it('should PATCH to the API without export_countries', () => {
            // Technically the POST data will not contain the following fields
            // were_countries_discussed
            // [FUTURE_INTEREST]
            // [EXPORTING_TO]
            // [NOT_INTERESTED]
            // However this test ensures that even if they are there they are not getting passed to the API
            expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
              this.middlewareParameters.reqMock.session.token,
              {
                contact: interactionDataWithCountries.contact,
                dit_team: interactionDataWithCountries.dit_team,
                service: 'Providing Export Advice & Information',
                subService: ['Providing Export Advice & Information'],
                'sv2-q1': 'sv2-a1',
                subject: 'subject',
                notes: 'notes',
                dit_adviser: interactionDataWithCountries.dit_adviser,
                service_answers: { 'sv2-q1': { 'sv2-a1': {} } },
                date: '2017-10-03',
                grant_amount_offered: null,
                net_company_receipt: null,
                contacts: [],
                dit_participants: [],
                policy_areas: [],
                policy_issue_types: [],
                status: 'complete',
                were_countries_discussed: 'true',
                [FUTURE_INTEREST]:
                  interactionDataWithCountries[FUTURE_INTEREST],
                [EXPORTING_TO]: interactionDataWithCountries[EXPORTING_TO],
                [NOT_INTERESTED]: interactionDataWithCountries[NOT_INTERESTED],
              }
            )
          })

          it('should flash an updated message', () => {
            expect(
              this.middlewareParameters.reqMock.flash
            ).to.be.calledOnceWithExactly('success', 'Interaction updated')
          })

          it('should redirect', () => {
            expect(
              this.middlewareParameters.resMock.redirect
            ).to.be.calledOnceWithExactly('/return/1')
          })
        })
      })
    })

    context('when there are server errors', () => {
      context('when the error is 400', () => {
        before(async () => {
          this.saveInteractionStub = sinon.stub()
          this.getServiceOptionsStub = sinon.stub()
          this.mapErrorsStub = sinon.stub()
          this.mapErrorsResponse = { mapErrors: true }

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
          })

          const middleware = proxyquire(modulePath, {
            '../repos': {
              saveInteraction: this.saveInteractionStub.rejects({
                statusCode: 400,
                error: '400-error',
              }),
            },
            '../../../lib/options': {
              getOptions: this.getServiceOptionsStub.resolves(
                serviceOptionsTransformed
              ),
            },
            '../macros/map-errors': this.mapErrorsStub.returns(
              this.mapErrorsResponse
            ),
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should not flash a message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.not.be.called
        })

        it('should not redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.not.be.called
        })

        it('should map and set the errors on locals', () => {
          expect(this.mapErrorsStub).to.have.been.calledOnceWithExactly(
            '400-error'
          )
          expect(this.middlewareParameters.resMock.locals.form).to.deep.equal({
            errors: {
              messages: this.mapErrorsResponse,
            },
          })
        })

        it('should call next without errors', () => {
          expect(
            this.middlewareParameters.nextSpy
          ).have.been.calledOnceWithExactly()
        })
      })

      context('when the error is 500', () => {
        before(async () => {
          this.saveInteractionStub = sinon.stub()
          this.getServiceOptionsStub = sinon.stub()

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: { ...interactionData },
            requestParams: {
              kind: 'interaction',
            },
            interactions: {
              returnLink: '/return/',
            },
          })

          const middleware = proxyquire(modulePath, {
            '../repos': {
              saveInteraction: this.saveInteractionStub.rejects({
                statusCode: 500,
                error: 'error',
              }),
            },
            '../../../lib/options': {
              getOptions: this.getServiceOptionsStub.resolves(
                serviceOptionsTransformed
              ),
            },
          })

          await middleware.postDetails(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
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
          expect(
            this.middlewareParameters.nextSpy
          ).have.been.calledOnceWithExactly({
            error: 'error',
            statusCode: 500,
          })
        })
      })
    })
  })

  describe('#getInteractionDetails', () => {
    before(() => {
      this.fetchInteractionStub = sinon.stub()
      this.getContactStub = sinon.stub()
      this.getDitCompanyStub = sinon.stub()

      this.middleware = proxyquire(modulePath, {
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
      before(async () => {
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
        expect(
          this.middlewareParameters.resMock.locals.interaction
        ).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction', () => {
        expect(this.middlewareParameters.resMock.locals.company).to.deep.equal(
          this.company
        )
      })
    })

    context('when provided an investment interaction with no company', () => {
      before(async () => {
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
        expect(
          this.middlewareParameters.resMock.locals.interaction
        ).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction contact', () => {
        expect(this.middlewareParameters.resMock.locals.company).to.deep.equal(
          this.company
        )
      })
    })
  })
})
