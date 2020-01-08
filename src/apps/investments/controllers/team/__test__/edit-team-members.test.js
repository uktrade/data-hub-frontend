const investmentData = require('../../../../../../test/unit/data/investment/investment-data.json')

describe('Investment project, team members, edit controller', () => {
  beforeEach(() => {
    this.nextStub = sinon.stub()
    this.flashStub = sinon.stub()
    this.breadcrumbStub = sinon.stub().returnsThis()

    this.controller = require('../edit-team-members')
  })

  describe('#renderTeamEdit', () => {
    it('should render edit team management view', (done) => {
      this.controller.renderTeamEdit(
        {
          session: {
            token: 'abcd',
          },
        },
        {
          locals: {
            investment: investmentData,
          },
          breadcrumb: this.breadcrumbStub,
          render: (template) => {
            try {
              expect(template).to.equal(
                'investments/views/team/edit-team-members'
              )
              done()
            } catch (e) {
              done(e)
            }
          },
        },
        this.nextStub
      )
    })
  })
})
