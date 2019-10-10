const { localHeader, companyBusinessDetailsSector: selectors } = require('../../../../selectors')
const { dnbLtd } = require('../../fixtures').company

const businessDetailsUrl = `/companies/${dnbLtd.id}/business-details`
const editSectorUrl = `${businessDetailsUrl}/sector`

describe('Companies business details - sector', () => {
  context('when viewing the sector of a Dun & Bradstreet company in the UK', () => {
    before(() => {
      cy.visit(businessDetailsUrl)
    })

    it('should show an "Edit" link with the correct URL', () => {
      cy.get(selectors.editSectorLink)
        .should('have.text', 'Edit')
        .should('have.prop', 'href')
        .and('contain', editSectorUrl)
    })

    it('should take you to the "Edit the DIT sector" page when clicked', () => {
      cy.get(selectors.editSectorLink).click()
        .url().should('contain', editSectorUrl)
    })
  })

  context('when viewing the edit sector page', () => {
    before(() => {
      cy.visit(editSectorUrl)
    })

    it('should display the "Edit the DIT sector" heading', () => {
      cy.get(localHeader().heading)
        .should('be.visible')
        .should('have.text', 'Edit the DIT sector')
    })

    it('should show a "DIT sector" label above the select', () => {
      cy.get(selectors.editSectorListLabel)
        .should('be.visible')
        .should('have.text', 'DIT sector')
    })

    it('should show a list of 256 sectors', () => {
      cy.get(selectors.editSectorList)
        .should('be.visible')
        .should('have.length', 256)
    })

    it('should show a "Save a return" button', () => {
      cy.get(selectors.saveAndReturnBtn)
        .should('be.visible')
        .should('have.text', 'Save and return')
    })

    it('should take you back to the "Business details" page when saving', () => {
      cy.get(selectors.saveAndReturnBtn).click()
        .url().should('contain', businessDetailsUrl)
    })

    it('should show a "Return without saving" link with the correct URL', () => {
      cy.get(selectors.returnWithoutSavingLink)
        .should('be.visible')
        .should('have.text', 'Return without saving')
        .should('have.prop', 'href')
        .and('contain', businessDetailsUrl)
    })
  })
})
