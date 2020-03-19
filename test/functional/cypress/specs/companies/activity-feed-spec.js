const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { testBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

describe('Company activity feed', () => {
  const commonTests = ({
    expectedHeading,
    expectedAddress,
    expectedCompanyId,
    expectedActivitiesHeading,
  }) => {
    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        expectedHeading
      )
    })

    it('should display the address', () => {
      cy.get(selectors.localHeader().headingAfter).should(
        'have.text',
        expectedAddress
      )
    })

    it('should display the "View full business details" link', () => {
      const selector = selectors
        .localHeader()
        .viewFullBusinessDetailsLink(expectedCompanyId)
      cy.get(selector).should('have.text', 'View full business details')
    })

    it('should display the local nav', () => {
      cy.get(selectors.tabbedLocalNav().item(1)).should('have.text', 'Activity')
      cy.get(selectors.tabbedLocalNav().item(2)).should(
        'have.text',
        'Company contacts'
      )
      cy.get(selectors.tabbedLocalNav().item(3)).should(
        'have.text',
        'Core team'
      )
      cy.get(selectors.tabbedLocalNav().item(4)).should(
        'have.text',
        'Investment'
      )
      cy.get(selectors.tabbedLocalNav().item(5)).should('have.text', 'Export')
      cy.get(selectors.tabbedLocalNav().item(6)).should('have.text', 'Orders')
    })

    it('should display the "Activities" heading', () => {
      cy.get(selectors.companyCollection().heading).should(
        'have.text',
        expectedActivitiesHeading
      )
    })
  }

  context('when viewing Venus Ltd which has no activities', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.venusLtd.id))
    })

    testBreadcrumbs({
      Home: '/',
      Companies: '/companies',
      'Venus Ltd': '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
      'Activity Feed': null,
    })

    commonTests({
      expectedHeading: fixtures.company.venusLtd.name,
      expectedAddress: '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
      expectedCompanyId: fixtures.company.venusLtd.id,
      expectedActivitiesHeading: 'Activities',
    })

    it('should display "Add interaction" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.addButton(fixtures.company.venusLtd.id)
      ).should('have.text', 'Add interaction')
    })

    it('should not display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should(
        'not.be.visible'
      )
    })

    it('should display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should(
        'be.visible'
      )
    })
  })

  context('when viewing activity feed for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.archivedLtd.id))
    })

    testBreadcrumbs({
      Home: '/',
      Companies: '/companies',
      'Archived Ltd': '/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3',
      'Activity Feed': null,
    })

    commonTests({
      expectedHeading: fixtures.company.archivedLtd.name,
      expectedAddress: '16 Getabergsvagen, Geta, 22340, Malta',
      expectedCompanyId: fixtures.company.archivedLtd.id,
      expectedActivitiesHeading: '1 activity',
    })

    it('should display the badge', () => {
      cy.get(selectors.localHeader().badge(1)).should('have.text', 'Global HQ')
    })

    it('should display the One List tier', () => {
      const expected =
        'This is an account managed company (One List Tier A - Strategic Account)'
      cy.get(selectors.localHeader().description.paragraph(1)).should(
        'have.text',
        expected
      )
    })

    it('should display the Global Account Manager', () => {
      const expected = 'Global Account Manager: Travis Greene View core team'
      cy.get(selectors.localHeader().description.paragraph(2)).should(
        'have.text',
        expected
      )
    })

    it('should not display the "Add interaction" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.addButton(fixtures.company.archivedLtd.id)
      ).should('not.exist')
    })

    it('should display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should(
        'be.visible'
      )
    })

    it('should not display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should(
        'not.be.visible'
      )
    })
  })

  context('when company has a DUNS number (is matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.dnbCorp.id))
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      ).should('not.exist')
    })
  })

  context('when company does NOT have a DUNS number (is NOT matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.lambdaPlc.id))
    })

    it('should display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      )
        .parent()
        .next()
        .should('match', 'details')
        .should(
          'have.text',
          'Why verify?Using verified business details from a trusted third-party supplier' +
            ' means we can keep certain information up to date automatically. This' +
            ' helps reduce duplicate records, provide a shared view of complex' +
            ' companies and make it more likely we can link other data sources' +
            ' together.Verification can often be done in just 4 clicks.'
        )
        .next()
        .should('have.text', 'Verify business details')
        .should(
          'have.attr',
          'href',
          urls.companies.match.index(fixtures.company.lambdaPlc.id)
        )
    })

    it('should have the Analytics id', () => {
      cy.get('#ga-company-details-matching-prompt').should(
        'have.attr',
        'id',
        'ga-company-details-matching-prompt'
      )
    })

    it('should not display the pending D&B investigation message', () => {
      cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should(
        'not.be.visible'
      )
    })
  })

  context('when company is pending D&B investigation', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.investigationLimited.id)
      )
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'There might be wrong information on this company page because' +
          " it doesn't get updated automatically."
      ).should('not.exist')
    })

    it('should display the pending D&B investigation message', () => {
      cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should(
        'be.visible'
      )
    })
  })
})
