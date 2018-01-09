const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment project, team members, edit controller', () => {
  beforeEach(() => {
    this.nextStub = sandbox.stub()
    this.flashStub = sandbox.stub()
    this.breadcrumbStub = sandbox.stub().returnsThis()

    this.controller = require('~/src/apps/investment-projects/controllers/team/edit-team-members')
  })

  describe('#renderTeamEdit', () => {
    it('should render edit team management view', (done) => {
      this.controller.renderTeamEdit({
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
})
