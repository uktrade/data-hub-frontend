const { find, set } = require('lodash')

const transformCompanyToOneListView = require('~/src/apps/companies/transformers/company-to-one-list-view')

const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const oneListGroupCoreTeam = require('~/test/unit/data/companies/one-list-group-core-team.json')

describe('transformCompanyToOneListView', () => {
  context('when One List tier and Global Account Manager information exists', () => {
    beforeEach(() => {
      const company = {
        ...minimalCompany,
        one_list_group_tier: {
          name: 'Tier A - Strategic Account',
          id: 'b91bf800-8d53-e311-aef3-441ea13961e2',
        },
      }

      const globalAccountManager = find(oneListGroupCoreTeam, adviser => adviser.is_global_account_manager)

      this.actual = transformCompanyToOneListView(company, globalAccountManager)
    })

    it('should set the One List tier', () => {
      expect(this.actual['One List tier']).to.equal('Tier A - Strategic Account')
    })

    it('should set the Global Account Manager', () => {
      const expected = [
        'Travis Greene',
        'IST - Sector Advisory Services',
        'London',
      ]

      expect(this.actual['Global Account Manager']).to.deep.equal(expected)
    })
  })

  context('when One List tier and Global Account Manager information exists', () => {
    beforeEach(() => {
      const company = {
        ...minimalCompany,
        one_list_group_tier: null,
      }

      const globalAccountManager = undefined

      this.actual = transformCompanyToOneListView(company, globalAccountManager)
    })

    it('should set the One List tier to None', () => {
      expect(this.actual['One List tier']).to.equal('None')
    })

    it('should set the Global Account Manager to None', () => {
      expect(this.actual['Global Account Manager']).to.equal('None')
    })
  })

  context('when Global Account Manager if from outside UK', () => {
    beforeEach(() => {
      const company = {
        ...minimalCompany,
        one_list_group_tier: null,
      }

      const globalAccountManager = find(oneListGroupCoreTeam, adviser => adviser.is_global_account_manager)
      set(globalAccountManager, 'adviser.dit_team.uk_region', null)
      set(globalAccountManager, 'adviser.dit_team.country', { name: 'France' })

      this.actual = transformCompanyToOneListView(company, globalAccountManager)
    })

    it('set the Global Account Manager', () => {
      const expected = [
        'Travis Greene',
        'IST - Sector Advisory Services',
        'France',
      ]

      expect(this.actual['Global Account Manager']).to.deep.equal(expected)
    })
  })
})
