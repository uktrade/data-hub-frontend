const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment project, team members, edit controller', () => {
  beforeEach(() => {
    this.nextStub = sandbox.stub()
    this.flashStub = sandbox.stub()
    this.breadcrumbStub = sandbox.stub().returnsThis()

    this.controller = require('~/src/apps/investment-projects/controllers/team/edit-team-members')
  })

  describe('#getHandler', () => {
    it('should render edit project management view', (done) => {
      this.controller.getHandler({
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
            expect(template).to.equal('investment-projects/views/team/edit-team-members')
            done()
          } catch (e) {
            done(e)
          }
        },
      }, this.nextStub)
    })
  })

  describe('#postHandler', () => {
    describe('without errors', () => {
      it('should redirect to the product team details page', (done) => {
        this.controller.postHandler({
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
              expect(url).to.equal(`/investment-projects/${investmentData.id}/team`)
              expect(this.flashStub).to.calledWith('success', 'Investment details updated')
              done()
            } catch (e) {
              done(e)
            }
          },
        }, this.nextStub)
      })
    })

    describe('when form errors exist', () => {
      it('should pass the error onto the edit form', () => {
        this.controller.postHandler({
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
