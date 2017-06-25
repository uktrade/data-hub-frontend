const investmentProjectData = require('~/test/unit/data/investment/project-summary.json')

describe('Investment Interactions edit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextStub = this.sandbox.stub()
    this.flashStub = this.sandbox.stub()

    this.controller = require('~/src/apps/investment-projects/controllers/interactions/edit.controller')
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
          title: [],
          projectData: investmentProjectData,
        },
        render: (template) => {
          try {
            expect(template).to.equal('investment/interaction/edit')
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
            title: [],
            form: {
              errors: {},
            },
            projectData: investmentProjectData,
          },
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investment/${investmentProjectData.id}/interactions`)
              expect(this.flashStub).to.calledWith('success-message', 'Investment Interaction successfully updated')
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
