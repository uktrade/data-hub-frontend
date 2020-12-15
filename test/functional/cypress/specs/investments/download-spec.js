const { investments } = require('../../../../../src/lib/urls')

describe('Investment Project Collections', () => {
  context('when filters are applied', () => {
    before(() => {
      cy.visit(investments.projects.index(), {
        qs: { page: 2, estimated_land_date_before: '2020-11-19' },
      })
      cy.get('[data-cy="download-data-header"]')
        .as('downloadDataHeader')
        .find('a')
        .as('downloadDataButton')
    })

    it('should show download link', () => {
      cy.get('@downloadDataHeader')
        .should('have.length', 1)
        .should('contain', 'You can now download these 12 projects')

      cy.get('@downloadDataButton')
        .should('have.length', 1)
        .should('contain', 'Download')
        .should(
          'have.attr',
          'href',
          '/investments/projects/export?estimated_land_date_before=2020-11-19'
        )
    })
  })

  context('when over 5,000 projects are returned', () => {
    before(() => {
      cy.visit(investments.projects.index())
      cy.get('[data-cy="download-data-header"]').as('downloadDataHeader')
    })

    it('should show "filter to fewer than 5,000"', () => {
      cy.get('@downloadDataHeader')
        .should('have.length', 1)
        .should('contain', 'Filter to fewer than 5,000 projects to download')

      cy.get('@downloadDataHeader').find('a').should('not.exist')
    })
  })
})
