const transformCompanyToOneListView = require('../company-to-one-list-view')

const companyMock = require('../../../../../test/unit/data/companies/company-v4.json')

describe('transformCompanyToOneListView', () => {
  const commonTests = (expectedOneListTier, expectedGlobalAccountManager) => {
    it('should set the One List tier', () => {
      expect(this.actual['One List tier']).to.equal(expectedOneListTier)
    })

    it('should set the Global Account Manager', () => {
      expect(this.actual['Global Account Manager']).to.deep.equal(expectedGlobalAccountManager)
    })
  }

  context('when the business is on the One List', () => {
    beforeEach(() => {
      this.actual = transformCompanyToOneListView(companyMock)
    })

    commonTests('Tier A - Strategic Account', [
      'Travis Greene',
      'IST - Sector Advisory Services',
      'London',
    ])
  })

  context('when the business is not on the One List', () => {
    beforeEach(() => {
      const company = {
        ...companyMock,
        one_list_group_tier: null,
        one_list_group_global_account_manager: null,
      }

      this.actual = transformCompanyToOneListView(company)
    })

    it('should not set One List details', () => {
      expect(this.actual).to.not.exist
    })
  })

  context('when Global Account Manager if from outside UK', () => {
    beforeEach(() => {
      const company = {
        ...companyMock,
        one_list_group_global_account_manager: {
          ...companyMock.one_list_group_global_account_manager,
          dit_team: {
            ...companyMock.one_list_group_global_account_manager.dit_team,
            uk_region: null,
            country: {
              name: 'France',
            },
          },
        },
      }

      this.actual = transformCompanyToOneListView(company)
    })

    commonTests('Tier A - Strategic Account', [
      'Travis Greene',
      'IST - Sector Advisory Services',
      'France',
    ])
  })
})
