const investmentProjectData = require('~/test/unit/data/investment/project-summary.json')

describe('Investment Interactions create controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.flashStub = this.sandbox.stub()

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
      }, {
        locals: {
          title: [],
          projectData: investmentProjectData,
        },
        render: (template) => {
          try {
            expect(template).to.equal('investment-projects/views/interactions/create')
            done()
          } catch (e) {
            done(e)
          }
        },
      }, this.nextStub)
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
        }, {
          locals: {
            title: [],
            form: {
              errors: {},
            },
            projectData: investmentProjectData,
          },
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investment-projects/${investmentProjectData.id}/interactions`)
              expect(this.flashStub).to.calledWith('success', 'Investment Interaction successfully created')
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
        this.controller.createPostInteractionHandler({
          session: {
            token: 'abcd',
          },
        }, {
          locals: {
            title: [],
            form: {
              errors: {
                subject: 'example error',
              },
            },
          },
        }, this.nextStub)

        expect(this.nextStub).to.be.calledOnce
      })
    })
  })
})
