const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const {
  assertExportProjectButton,
  assertAddInteractionButton,
} = require('../../../support/company-local-header-assertions')

const companyId = fixtures.company.dnbCorp.id
const exportProjectUrl = urls.exportPipeline.create(companyId)
const addInteractionUrl = urls.companies.interactions.create(companyId)

describe('Local header buttons', () => {
  context('when the add export project button is clicked', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(companyId))
    })

    it('should display the add export project link', () => {
      assertExportProjectButton(exportProjectUrl)
    })

    it('should click the add export project link', () => {
      cy.get('[data-test=header-add-export-project]').click()
      cy.location().should((loc) => {
        expect(loc.pathname + loc.search).to.eq(exportProjectUrl)
      })
    })

    it('should display the correct add interaction button', () => {
      assertAddInteractionButton(addInteractionUrl)
    })

    it('should click the add interaction button', () => {
      cy.get('[data-test="header-add-interaction"]').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(addInteractionUrl)
      })
    })
  })
})
