const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { companies } = require('../../../../../src/lib/urls')

describe('Company Global Ultimate HQ', () => {
  context('when a company has a DnB Ultimate HQ badge', () => {
    before(() => {
      cy.visit(
        `${companies.activity.index(fixtures.company.dnbGlobalUltimate.id)}`
      )
    })

    it('should display an "Ultimate HQ" badge', () => {
      cy.get(selectors.localHeader().badge(1)).should('be.visible')
    })

    it('should display an "What does this mean?" details', () => {
      cy.get(selectors.localHeader().metaList)
        .should('contain', 'What does this mean?')
        .should(
          'contain',
          'This HQ is in control of all related company records for DnB Global Ultimate'
        )
    })

    it('should display two subsidiaries', () => {
      const expected =
        'Data Hub contains 2 other company records related to this company'
      cy.get(selectors.localHeader().description.paragraph(1)).should(
        'have.text',
        expected
      )
    })
  })
})
