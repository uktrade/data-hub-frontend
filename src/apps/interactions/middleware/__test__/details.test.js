const proxyquire = require('proxyquire')

const urls = require('../../../../lib/urls')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const interactionData = require('../../../../../test/unit/data/interactions/new-interaction')
const interactionDataWithCountries = require('../../../../../test/unit/data/interactions/new-interaction-with-countries')
const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data')
const company = require('../../../../../test/unit/data/company')

const { EXPORT_INTEREST_STATUS } = require('../../../constants')

const { transformServicesOptions } = require('../../transformers')

const modulePath = '../details'
const { FUTURE_INTEREST, EXPORTING_TO, NOT_INTERESTED } = EXPORT_INTEREST_STATUS

const serviceOptionsTransformed = transformServicesOptions(serviceOptions)

let referralId

describe('Interaction details middleware', () => {
  describe('#postDetails', () => {
    let formBodyToApiRequestResponse
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
              company,
            })

            formBodyToApiRequestResponse = {
              form: true,
              transform: true,
              apiRequest: true,
              value: 'new interaction',
            }

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../transformers': {
                transformServicesOptions,
                transformInteractionFormBodyToApiRequest: sinon
                  .stub()
                  .returns(formBodyToApiRequestResponse),
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
              formBodyToApiRequestResponse,
              referralId
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
              company,
            })

            formBodyToApiRequestResponse = {
              form: true,
              transform: true,
              apiRequest: true,
              value: 'existing interaction',
            }

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../transformers': {
                transformServicesOptions,
                transformInteractionFormBodyToApiRequest: sinon
                  .stub()
                  .returns(formBodyToApiRequestResponse),
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
              formBodyToApiRequestResponse,
              referralId
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
          context('when countries were discussed', () => {
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
                company,
              })

              formBodyToApiRequestResponse = {
                form: true,
                transform: true,
                apiRequest: true,
                value: 'countries discussed true',
              }

              const middleware = proxyquire(modulePath, {
                '../repos': {
                  saveInteraction: this.saveInteractionStub.resolves({
                    id: '1',
                    were_countries_discussed: true,
                  }),
                },
                '../transformers': {
                  transformServicesOptions,
                  transformInteractionFormBodyToApiRequest: sinon
                    .stub()
                    .returns(formBodyToApiRequestResponse),
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
              expect(
                this.saveInteractionStub
              ).to.have.been.calledOnceWithExactly(
                this.middlewareParameters.reqMock.session.token,
                formBodyToApiRequestResponse,
                referralId
              )
            })

            it('should flash a created message with a body', () => {
              expect(
                this.middlewareParameters.reqMock.flashWithBody
              ).to.be.calledOnceWithExactly(
                'success',
                'Interaction created',
                `You discussed some countries within the interaction, <a href="${urls.companies.exports.index(
                  company.id
                )}">click here to view all countries</a> within the export tab`
              )
            })

            it('should redirect', () => {
              expect(
                this.middlewareParameters.resMock.redirect
              ).to.be.calledOnceWithExactly('/return/1')
            })
          })

          context('when countries were NOT discussed', () => {
            before(async () => {
              this.saveInteractionStub = sinon.stub()
              this.getServiceOptionsStub = sinon.stub()

              this.middlewareParameters = buildMiddlewareParameters({
                requestBody: {
                  ...interactionData,
                  were_countries_discussed: 'false',
                },
                requestParams: {
                  theme: 'export',
                  kind: 'interaction',
                },
                interactions: {
                  returnLink: '/return/',
                },
                company,
              })

              formBodyToApiRequestResponse = {
                form: true,
                transform: true,
                apiRequest: true,
                value: 'countries discussed false',
              }

              const middleware = proxyquire(modulePath, {
                '../repos': {
                  saveInteraction: this.saveInteractionStub.resolves({
                    id: '1',
                    were_countries_discussed: false,
                  }),
                },
                '../transformers': {
                  transformServicesOptions,
                  transformInteractionFormBodyToApiRequest: sinon
                    .stub()
                    .returns(formBodyToApiRequestResponse),
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
              expect(
                this.saveInteractionStub
              ).to.have.been.calledOnceWithExactly(
                this.middlewareParameters.reqMock.session.token,
                formBodyToApiRequestResponse,
                referralId
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
              company,
            })

            formBodyToApiRequestResponse = {
              form: true,
              transform: true,
              apiRequest: true,
              value: 'countries discussed false',
            }

            const middleware = proxyquire(modulePath, {
              '../repos': {
                saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
              },
              '../transformers': {
                transformServicesOptions,
                transformInteractionFormBodyToApiRequest: sinon
                  .stub()
                  .returns(formBodyToApiRequestResponse),
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
            expect(this.saveInteractionStub).to.have.been.calledOnceWithExactly(
              this.middlewareParameters.reqMock.session.token,
              formBodyToApiRequestResponse,
              referralId
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
            company,
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
            company,
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
