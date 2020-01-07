const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Companies Export', () => {
  context('when viewing exports for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/exports`)
    })

    it('should not display the "Add export" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .export.editButton(fixtures.company.oneListCorp.id)
      ).should('not.exist')
    })
  })
})
