const { setLocalNavForApp } = require('~/src/apps/investment-projects/middleware/local-nav.js')

describe('Local nav middleware', () => {
  beforeEach(() => {
    this.req = {
      baseUrl: 'base',
    }
    this.res = {}
    this.nextSpy = sinon.spy()
  })

  context('#setLocalNavForApp', () => {
    context('when feature flags are not enabled and the user does not have permissions', () => {
      beforeEach(() => {
        this.res = {
          ...this.res,
          locals: {
            features: {},
            user: {
              permissions: [],
            },
          },
        }

        setLocalNavForApp(this.req, this.res, this.nextSpy)
      })

      it('should set the local nav without items that are feature flagged or require permissions', () => {
        expect(this.res.locals.localNavItems.map(item => item.label)).to.deep.equal([
          'Project details',
          'Project team',
          'Evaluations',
          'Audit history',
        ])
      })
    })

    context('when feature flags are not enabled and the user has view permissions', () => {
      beforeEach(() => {
        this.res = {
          ...this.res,
          locals: {
            features: {},
            user: {
              permissions: [
                'interaction.view_all_interaction',
                'proposition.view_all_proposition',
                'investment.view_investmentproject_document',
                'evidence.read_all_evidencedocument',
              ],
            },
          },
        }

        setLocalNavForApp(this.req, this.res, this.nextSpy)
      })

      it('should set the local nav without items that are feature flagged and with items that require permissions', () => {
        expect(this.res.locals.localNavItems.map(item => item.label)).to.deep.equal([
          'Project details',
          'Project team',
          'Interactions',
          'Evaluations',
          'Audit history',
          'Documents',
        ])
      })
    })

    context('when feature flags are enabled and the user has view permissions', () => {
      beforeEach(() => {
        this.res = {
          ...this.res,
          locals: {
            features: {
              'proposition-documents': true,
              'investment-evidence': true,
            },
            user: {
              permissions: [
                'interaction.view_all_interaction',
                'proposition.view_all_proposition',
                'investment.view_investmentproject_document',
                'evidence.read_all_evidencedocument',
              ],
            },
          },
        }

        setLocalNavForApp(this.req, this.res, this.nextSpy)
      })

      it('should set the local nav with items that are feature flagged and require permissions', () => {
        expect(this.res.locals.localNavItems.map(item => item.label)).to.deep.equal([
          'Project details',
          'Project team',
          'Interactions',
          'Propositions',
          'Evaluations',
          'Audit history',
          'Documents',
          'Evidence',
        ])
      })
    })
  })
})
