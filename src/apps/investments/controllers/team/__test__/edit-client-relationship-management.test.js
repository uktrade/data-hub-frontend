const proxyquire = require('proxyquire')

const investmentData = require('../../../../../../test/unit/data/investment/investment-data.json')
const paths = require('../../../paths')

describe('Investment project, client relationship management, edit controller', () => {
  beforeEach(() => {
    this.nextStub = sinon.stub()
    this.flashStub = sinon.stub()
    this.getDataLabelsStub = sinon.stub()
    this.breadcrumbStub = sinon.stub().returnsThis()

    this.controller = proxyquire('../edit-client-relationship-management', {
      '../../../../lib/controller-utils': {
        getDataLabels: this.getDataLabelsStub,
      },
    })
  })

  describe('#getHandler', () => {
    it('should render edit client relationship management view', (done) => {
      this.controller.getHandler({
        session: {
          token: 'abcd',
        },
      }, {
        locals: {
          paths,
          investment: investmentData,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template) => {
          try {
            expect(template).to.equal('investments/views/team/edit-client-relationship-management')
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
            paths,
            form: {
              errors: {},
            },
            investment: investmentData,
          },
          breadcrumb: this.breadcrumbStub,
          redirect: (url) => {
            try {
              expect(url).to.equal(`/investments/projects/${investmentData.id}/team`)
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
            paths,
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
