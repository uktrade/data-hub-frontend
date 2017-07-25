const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment Interactions create controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.flashStub = this.sandbox.stub()
    this.resMock = {
      breadcrumb: {
        add: () => this.resMock,
        update: () => this.resMock,
        get: () => [],
      },
    }

    this.controller = require('~/src/apps/investment-projects/controllers/interactions/create')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#createGetInteractionHandler', () => {
    it('should render create investment interaction view', (done) => {
      this.controller.createGetInteractionHandler({
        session: {
          token: 'abcd',
        },
      }, Object.assign(this.resMock, {
        locals: {
          investmentData,
        },
        render: (template) => {
          try {
            expect(template).to.equal('investment-projects/views/interactions/create')
            done()
          } catch (e) {
            done(e)
          }
        },
      }), this.nextStub)
    })
  })

  describe('#createPostInteractionHandler', () => {
    describe('without errors', () => {
      it('should redirect to the investment project interactions list page', (done) => {
        this.controller.createPostInteractionHandler({
          session: {
            token: 'abcd',
          },
          flash: this.flashStub,
        }, Object.assign(this.resMock, {
          locals: {
            form: {
              errors: {},
            },
            investmentData,
          },
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investment-projects/${investmentData.id}/interactions`)
              expect(this.flashStub).to.calledWith('success', 'Investment Interaction successfully created')
              done()
            } catch (e) {
              done(e)
            }
          },
        }), this.nextStub)
      })
    })

    describe('when form errors exist', () => {
      it('should render create investment interactions form', () => {
        this.controller.createPostInteractionHandler({
          session: {
            token: 'abcd',
          },
        }, Object.assign(this.resMock, {
          locals: {
            form: {
              errors: {
                subject: 'example error',
              },
            },
          },
        }), this.nextStub)

        expect(this.nextStub).to.be.calledOnce
      })
    })
  })
})
