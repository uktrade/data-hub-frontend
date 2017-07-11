const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment Interactions edit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.flashStub = this.sandbox.stub()
    this.breadcrumbStub = function () { return this }

    this.controller = require('~/src/apps/investment-projects/controllers/interactions/edit')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#editGetInteractionHandler', () => {
    it('should render create investment interaction view', (done) => {
      this.controller.editGetInteractionHandler({
        session: {
          token: 'abcd',
        },
      }, {
        locals: {
          investmentData,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template) => {
          try {
            expect(template).to.equal('investment-projects/views/interactions/edit')
            done()
          } catch (e) {
            done(e)
          }
        },
      }, this.nextStub)
    })
  })

  describe('#editPostInteractionHandler', () => {
    describe('without errors', () => {
      it('should redirect to the investment project interactions list page', (done) => {
        this.controller.editPostInteractionHandler({
          session: {
            token: 'abcd',
          },
          flash: this.flashStub,
        }, {
          locals: {
            form: {
              errors: {},
            },
            investmentData,
          },
          breadcrumb: this.breadcrumbStub,
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investment-projects/${investmentData.id}/interactions`)
              expect(this.flashStub).to.calledWith('success', 'Investment Interaction successfully updated')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.nextStub)
      })
    })

    describe('when form errors exist', () => {
      it('should render create investment interactions form', () => {
        this.controller.editPostInteractionHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            form: {
              errors: {
                subject: 'example error',
              },
            },
          },
          breadcrumb: this.breadcrumbStub,
        }, this.nextStub)

        expect(this.nextStub).to.be.calledOnce
      })
    })
  })
})
