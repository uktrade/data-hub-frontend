const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldRadios,
  assertFieldTypeahead,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const metadataTiers = require('../../../../sandbox/fixtures/metadata/one-list-tier.json')
const urls = require('../../../../../src/lib/urls')

describe('Edit One List', () => {
  const visitWithWait = (companyId, url) => {
    cy.intercept(
      `/api-proxy/v4/company/${companyId}/one-list-group-core-team`
    ).as('oneListTeam')
    cy.intercept(`/api-proxy/v4/metadata/one-list-tier`).as('oneListTiers')
    cy.intercept(`/api-proxy/v4/company/${companyId}`).as('company')

    cy.visit(url)

    cy.wait(['@oneListTeam', '@oneListTiers', '@company'])
  }

  context('when viewing the "Edit One List" page', () => {
    const testCompany = fixtures.company.oneListCorp
    beforeEach(() => {
      visitWithWait(testCompany.id, urls.companies.editOneList(testCompany.id))
    })

    it('should render the header', () => {
      assertLocalHeader(`Edit core team of ${testCompany.name}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [testCompany.name]: urls.companies.detail(testCompany.id),
        'Edit core team': null,
      })
    })
  })

  context('when editing details of an existing One List company', () => {
    const testCompany = fixtures.company.oneListCorp

    beforeEach(() => {
      cy.setModulePermissions([
        'company.view_company',
        'company.change_company',
        'company.change_one_list_tier_and_global_account_manager',
      ])
      visitWithWait(testCompany.id, urls.companies.editOneList(testCompany.id))
    })
    after(() => {
      cy.resetUser()
    })

    it('should render One List tier options with tier pre-selected', () => {
      metadataTiers.forEach((tier) => {
        cy.get(selectors.companyEditOneList.tierField).contains(tier.name)
      })

      cy.get(selectors.companyEditOneList.tierField).contains(
        'Not on the One List'
      )

      cy.get(selectors.companyEditOneList.tierField).then((element) => {
        assertFieldRadios({
          element,
          label: 'Company One List tier',
          optionsCount: 8,
          value: testCompany.one_list_group_tier.name,
        })
      })
    })

    it('should have the account manager pre-selected', () => {
      cy.contains('Continue').click()
      cy.get('#global_account_manager').should('exist')

      cy.get(selectors.companyEditOneList.globalAccountManagerField)
        .find('input')
        .invoke('val')
        .then((val) =>
          expect(val).to.contain(
            testCompany.one_list_group_global_account_manager.name
          )
        )
    })

    it('should submit updated data', () => {
      cy.contains('Continue').click()

      cy.get(
        selectors.companyEditOneList.globalAccountManagerField
      ).selectTypeaheadOptionInFieldset('shawn')

      cy.contains('Holly Collins').click({ force: true })

      cy.get(selectors.companyEditOneList.coreTeamFieldText).should(
        'not.contain',
        'Holly Collins'
      )

      cy.get(
        selectors.companyEditOneList.coreTeamField
      ).selectTypeaheadOptionInFieldset('leroy')

      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(testCompany.id)
      )
    })
  })

  context(
    'when editing details of a company that is not currently on One List',
    () => {
      const testCompany = fixtures.company.minimallyMinimalLtd

      beforeEach(() => {
        visitWithWait(
          testCompany.id,
          urls.companies.editOneList(testCompany.id)
        )
      })

      it('should not have a tier pre-selected', () => {
        cy.get('input[checked]').should('not.exist')
      })

      it('should not have an account manager pre-listed', () => {
        cy.contains('Tier A - Strategic Account').click()
        cy.contains('Continue').click()

        cy.get(selectors.companyEditOneList.globalAccountManagerField)
          .find('input')
          .should('have.attr', 'value', '')
      })

      it('should not have a core team pre-listed', () => {
        cy.contains('Tier A - Strategic Account').click()
        cy.contains('Continue').click()

        cy.get(selectors.companyEditOneList.coreTeamFieldText)
          .find('input')
          .should('have.attr', 'value', '')
      })

      it('should submit updated data', () => {
        cy.contains('Tier A - Strategic Account').click()
        cy.contains('Continue').click()

        cy.get(selectors.companyEditOneList.globalAccountManagerField)
          .selectTypeaheadOptionInFieldset('shawn')
          .find('input')
          .should('have.attr', 'value', 'Shawn Cohen, Charles Gilbert')

        cy.contains('Submit').click()

        cy.location('pathname').should(
          'eq',
          urls.companies.businessDetails(testCompany.id)
        )
      })
    }
  )

  context('when removing a company from One List tiers', () => {
    const testCompany = fixtures.company.oneListCorp

    before(() => {
      visitWithWait(testCompany.id, urls.companies.editOneList(testCompany.id))
    })

    it('should submit the form without manager information stage', () => {
      cy.contains('Not on the One List').click()

      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(testCompany.id)
      )
    })
  })

  context('when skipping step 1', () => {
    const testCompany = fixtures.company.oneListCorp
    const noOneListCompany = fixtures.company.dnbCorp

    context('with a company that has a one list tier', () => {
      before(() => {
        visitWithWait(
          testCompany.id,
          `${urls.companies.editOneList(testCompany.id)}?step=oneListAdvisers`
        )
      })

      it('should show the one list advisers step', () => {
        cy.get('[data-test="field-global_account_manager"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Global Account Manager',
            value: `${testCompany.one_list_group_global_account_manager.name}, ${testCompany.one_list_group_global_account_manager.dit_team.name}`,
            isMulti: false,
          })
        })
      })
    })

    context('with a company that is missing a one list tier', () => {
      before(() => {
        visitWithWait(
          noOneListCompany.id,
          `${urls.companies.editOneList(
            noOneListCompany.id
          )}?step=oneListAdvisers`
        )
      })

      it('should still show step 1 as this field is needed', () => {
        cy.get(selectors.companyEditOneList.tierField).then((element) => {
          assertFieldRadios({
            element,
            label: 'Company One List tier',
            optionsCount: 8,
          })
        })
      })
    })
  })

  context('when needing to override the return url', () => {
    const testCompany = fixtures.company.oneListCorp

    before(() => {
      visitWithWait(
        testCompany.id,
        `${urls.companies.editOneList(
          testCompany.id
        )}?step=oneListAdvisers&returnUrl=${urls.companies.accountManagement.index(
          testCompany.id
        )}`
      )
    })

    it('should return the user to the requested url on form submit', () => {
      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.accountManagement.index(testCompany.id)
      )
    })
  })

  context(
    'basic users assigned as account manager when editing One list',
    () => {
      const testCompany = fixtures.company.oneListCorp

      beforeEach(() => {
        cy.setModulePermissions([
          'company.view_company',
          'company.change_company',
        ])
        cy.setAdviserId(testCompany.one_list_group_global_account_manager.id)

        visitWithWait(
          testCompany.id,
          urls.companies.editOneList(testCompany.id)
        )
      })
      after(() => {
        cy.resetUser()
      })

      it('should have account manager field', () => {
        cy.contains('Continue').click()
        cy.get('#global_account_manager').should('exist')
      })

      it('should submit updated data', () => {
        cy.contains('Continue').click()

        cy.get(
          selectors.companyEditOneList.coreTeamField
        ).selectTypeaheadOptionInFieldset('leroy')

        cy.contains('Submit').click()

        cy.location('pathname').should(
          'eq',
          urls.companies.businessDetails(testCompany.id)
        )
      })
    }
  )

  context('not assigned as account managers when editing One list', () => {
    const testCompany = fixtures.company.oneListCorp

    beforeEach(() => {
      cy.setModulePermissions([
        'company.view_company',
        'company.change_company',
      ])
      visitWithWait(testCompany.id, urls.companies.editOneList(testCompany.id))
    })
    after(() => {
      cy.resetUser()
    })

    it('should not have account manager field', () => {
      cy.contains('Continue').click()
      cy.get('#global_account_manager').should('not.exist')
    })

    it('should submit updated data', () => {
      cy.contains('Continue').click()

      cy.get(
        selectors.companyEditOneList.coreTeamField
      ).selectTypeaheadOptionInFieldset('leroy')

      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(testCompany.id)
      )
    })
  })
})
