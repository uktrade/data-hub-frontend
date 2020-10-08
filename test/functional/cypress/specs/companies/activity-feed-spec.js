const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

describe('Company activity feed', () => {
  context('when viewing Venus Ltd which has no activities', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.venusLtd.id))
    })

    it('should display the activity header', () => {
      cy.get(selectors.companyCollection().heading).should(
        'have.text',
        'Activities'
      )
    })

    it('should display "Add interaction" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.addButton(fixtures.company.venusLtd.id)
      ).should('have.text', 'Add interaction')
    })

    it('should display "Refer this company" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.referButton(fixtures.company.venusLtd.id)
      ).should('have.text', 'Refer this company')
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

    it('should display the badge', () => {
      cy.get(companyLocalHeader.badge).should('have.text', 'Global HQ')
    })

    it('should display the One List tier', () => {
      const expected =
        'This is an account managed company (One List Tier A - Strategic Account)'
      cy.get(companyLocalHeader.description.paragraph(1)).should(
        'have.text',
        expected
      )
    })

    it('should display the Global Account Manager', () => {
      const expected = 'Global Account Manager: Travis Greene View core team'
      cy.get(companyLocalHeader.description.paragraph(2)).should(
        'have.text',
        expected
      )
    })

    it('should not display the "Add interaction" button', () => {
      cy.contains('Add interaction').should('not.exist')
    })

    it('should not display "Refer this company" button', () => {
      cy.contains('Refer this company').should('not.exist')
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
      cy.get('#ga-company-details-matching-prompt').should('exist')
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
